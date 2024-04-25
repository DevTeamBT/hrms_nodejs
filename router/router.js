const express = require('express');
const session = require('express-session');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../schema/userSchema'); 
const timeSheet = require('../schema/timeSheetSchema');
const addClient = require('../schema/addClientSchema');
const clientContact = require('../schema/clientContactSchema');
const clientRequirement = require('../schema/clientRequirementSchema');
const addTask = require('../schema/addTaskSchema');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const LocalStrategy = require('passport-local').Strategy;
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const { log } = require('console');


let upload;

module.exports = function(app) {
    // Multer setup for file uploads
    upload = multer({ dest: 'upload/' });
  
    app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());
}

//generate otp
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
};
// Nodemailer transporter setup

const transporter = nodemailer.createTransport({
  // host: 'smtp.bodhtree.com', // Replace with your SMTP server hostname
  //   port: 587, // Replace with your SMTP server port
  //   secure: false, 
  auth: {
      officeEmail:"Mpriyanka@bodhtree.com",
      enterPassword:"Th!nk@2919" 
      
  }
});


//router.set('view engine', 'ejs');
router.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// POST api to create user 
router.post('/api/users', async (req, res) => {
  try {
        // Check if a user with the same enterCode or officeEmail already exists
        const existingUser = await User.findOne({
          $or: [{ enterCode: req.body.enterCode }, { officeEmail: req.body.officeEmail }],
        });
        if (existingUser) {
          // User with the same enterCode or officeEmail already exists
          return res.status(400).json({ error: 'User already exists', details: 'Enter code or office email is already in use.' });
        }
        // Validate office email format
      if (req.body.officeEmail && !req.body.officeEmail.endsWith('@bodhtree.com')) {
        return res.status(400).json({ error: 'Invalid office email', details: 'Office email must end with @bodhtree.com.' });
      }
      //uploding  image file and saving its name in database
      let profileImageName = ''; // Initialize profileImageName variable
      // Check if files are uploaded
      if (req.files && req.files.profile_image) {
          const uploadPath = path.join(__dirname, '../images'); // Construct upload path
          console.log("Uploading Image");
          // Check if upload directory exists; if not, create it
          if (!fs.existsSync(uploadPath)) {
              fs.mkdirSync(uploadPath);
          }
          const file = req.files.profile_image; // Get uploaded file
          const filename = uuidv4() + path.extname(file.name); // Generate unique filename
          profileImageName = filename; // Store filename in profileImageName variable
          // Move uploaded file to upload path
          file.mv(`${uploadPath}/${filename}`, function(err) {
              if (err) {
                  // If there's an error moving the file, send 500 status response with error
                  return res.status(500).send(err);
              } else {
                  // If file upload is successful, send a success message or perform further actions
                  res.status(200).send("File uploaded successfully");
              }
          });
      }
    // Create a new user instance with data from the request
    const newUser = new User(req.body);
    // Save the user to the database
    const savedUser = await newUser.save();
    // Respond with the created user
    res.status(200).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

//get api of signup page create user
router.get('/api/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find the user by ID in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found', details: 'No user found with the provided ID.' });
    }
    // Respond with the retrieved user
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
//get api to gfetch all user names
router.get('/api/users', async (req, res) => {
  try {
    // Fetch all users and select only the fullName field
    const users = await User.find().select('fullName');

    // Respond with the retrieved users
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

//html and css of sign up page create user
router.get('/api/users', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/signup_page.html'));
});
router.get('/api/Createuser.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/Createuser.css'));
});

//get all api for add employee page
router.get('/users', async (req, res) => {
  try {
    // Find all users in the database
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).send('<h1>No users found</h1>'); // Send HTML for no users found
    }

    // Respond with HTML table
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <title>Employee Information</title>
        <style>
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
      <div class="container">
      <div>
          <figure><img src="https://bodhtree.com/wp-content/uploads/2016/02/logo-sticky.png"></figure>
          <h4><b>Employee Information </b></h4>
      </div>
        <table>
          <thead>
            <tr>
              <th>Sl.no</th>
              <th>Full Name</th>
              <th>reportsTo</th>
              <th>designation</th>
              <th>department</th>
              <th>bloodGroup</th>
              <th>dateOfJoining</th>
              <th>workType</th>
              <th>annual_ctc</th>
              <th>officeEmail</th>
              <th>workLocation</th>
              <th>mobileNo</th>
              <th>personal_Email</th>
              <th>gender</th>
              <th>native</th>
              <th>enterCode</th>
              <th>enterPassword</th>
              <th>role</th>
            </tr>
          </thead>
          <tbody>
            ${users.map((user, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${user.fullName}</td>
                <td>${user.reportsTo}</td>
                <td>${user.designation}</td>
                <td>${user.department}</td>
                <td>${user.bloodGroup}</td>
                <td>${user.dateOfJoining}</td>
                <td>${user.workType}</td>
                <td>${user.annual_ctc}</td>
                <td>${user.officeEmail}</td>
                <td>${user.workLocation}</td>
                <td>${user.mobileNo}</td>
                <td>${user.personal_Email}</td>
                <td>${user.gender}</td>
                <td>${user.native}</td>
                <td>${user.enterCode}</td>
                <td>${user.enterPassword}</td>
                <td>${user.role}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

//html and css of display page
router.get('/users', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/displayemp.html'));
});

//post api to login page
router.post('/login', async (req, res) => {
  try {
    const { officeEmail, enterPassword , fullName} = req.body;
    // Find the user in the database by office mail
    const user = await User.findOne({ officeEmail });
    // Check if the user exists
    if (user) {
      if (enterPassword === user.enterPassword) {
        // Authentication successful
       
        // Set the user's role in the session
        req.session.user = {
          officeEmail: user.officeEmail,
          role: user.role, 
          fullName: user.fullName,
        };
        // Redirect based on the user's role
        if (req.session.user.role === 'admin') {
          res.cookie('user', user.fullName, { maxAge: 900000, httpOnly: true });
          res.status(200).json({ message: 'Login successful', user: req.session.user });
          //res.redirect('/frontend/dashboard.html');
        } else if (req.session.user.role === 'employee') {
          res.cookie('user', user.fullName, { maxAge: 900000, httpOnly: true });
          res.status(200).json({ message: 'Login successful', user: req.session.user });
          //res.sendFile(path.join(__dirname, '../frontend/timesheet.html'));
          //return determineUserRole(user)
        } else {
          res.status(401).json({ message: 'Invalid role' });
        }
      } else {
        // Authentication failed
        res.status(401).json({ message: 'Invalid officeEmail or enterPassword' });
      }
    } else {
      // User not found
      res.status(401).json({ message: 'Invalid officeEmail or enterPassword' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

//html and css of login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/log.html'));
});
router.get('/login.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.css'));
});

//html of index
router.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
router.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/style.css'));
});
//addtask html
router.get('/Addtask', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/Addtask.html'));
});
router.get('/Addtask.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/Addtask.css'));
});

//reset password
    // router.put('/change-password', async (req, res) => {
    //   try {
    //     const { officeEmail, enterPassword } = req.body;
        
    //     // Find the user by office email
    //     const user = await User.findOneAndUpdate({ officeEmail }, { enterPassword }, { new: true });
    
    //     // Check if the user exists
    //     if (!user) {
    //       return res.status(404).json({ error: 'User not found' });
    //     }
    
    //     // Update the user's password
    //     user.enterPassword = enterPassword;
    
    //     // Save the updated user to the database
    //     await user.save();
    
    //     // Return success response
    //     return res.status(200).json({ message: 'Password changed successfully' });
       
    //   } catch (error) {
    //     console.error('Error changing password:', error);
    //     return res.status(500).json({ error: 'Internal server error' });
    //   }
    // });


    router.post('/generate-otp', async (req, res) => {
      const { officeEmail } = req.body;
      try {
        // Generate a random OTP
        const otp = generateOTP();
        // Set up the mail options for sending the OTP
        const mailOptions = {
          from: "shrestimadabhavi1998@gmail.com", // Replace this with your actual email address
          to: officeEmail,
          subject: 'OTP Verification',
          text: `Your OTP is: ${otp}`
        };
        // Send the email with the generated OTP
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Failed to send OTP' });
          } else {
            console.log('Email sent successfully');
            res.status(200).json({ message: 'OTP sent successfully' });
          }
        });
      } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ error: 'Failed to generate OTP' });
      }
    });
  
  // Route to change password using OTP
  router.post('/change-password', (req, res) => {
      const { officeEmail, otp, enterPassword } = req.body;
  
      if (!User[officeEmail]) {
          return res.status(404).json({ error: "User not found" });
      }
  
      if (User[officeEmail].otp !== otp) {
          return res.status(400).json({ error: "Invalid OTP" });
      }
  
      User[officeEmail].enterPassword = enterPassword;
      User[officeEmail].otp = null;
  
      res.status(200).json({ message: "Password changed successfully" });
  });
   
router.get('/password', (req, res) => {
  // Check if the user is authenticated
  if (!req.session.user) {
    // Redirect to the login page if not authenticated
    return res.redirect('/frontend/passchange');
  }
  // Serve the page.html content
  res.sendFile(path.join(__dirname, '../frontend/passchange.html'));
  //res.sendFile(path.join(__dirname, '../dashboard.css'));
});

//html and css of change password
router.get('/change-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/passchange.html'));
});
router.get('/generate-otp', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/passchange.html'));
});

//post api to direct to successful page
router.post('/dashboard', async (req, res) => {
  try {
    const loginSuccessful = true;

    if (loginSuccessful) {
      // Read and send the "page.html" content
      const htmlPath = path.join(__dirname, '/dashboard.html');
      const data = await fs.readFile(htmlPath, 'utf8');
      res.send(data);
    } else {
      // Handle unsuccessful login
      res.status(401).json({ message: 'Invalid officeEmail or enterPassword' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Handle /dashboard route to dashboard
router.get('/dashboard', (req, res) => {
  // Check if the user is authenticated
  if (!req.session.user) {
    // Redirect to the login page if not authenticated
    return res.redirect('/frontend/dashboard');
  }
  // Serve the page.html content
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
  //res.sendFile(path.join(__dirname, '../dashboard.css'));
});

// Handle /login.html route
router.get('/login', (req, res) => {
  const user = User.find();
  // Clear the user session on the login page
  req.session.user = null;
  // Serve the login.html content
  res.sendFile(path.join(__dirname, '../frontend/log.html'));
});

//html and css of dashboard
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});
router.get('/dashboard.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.css'));
});

//html and css of timesheet
router.get('/timesheet', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/timesheet.html'));
});
router.get('/timesheet.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/Timesheet.css'));
});



//post api to add client
router.post('/api/add/client', async (req, res) => {
  try {
    // Create a new company instance based on the request body
    const newCompany = new addClient(req.body);

    // Save the new company to the database
    await newCompany.save();

    // Respond with a success message
    res.status(201).json({ message: 'Company created successfully' });
    
  } catch (error) {
    // Handle errors
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
router.get('/api/add/client', async (req, res) => {
  try {
    // Fetch user data from the database
    const users = await User.find();

    // Clear the user session on the client
    req.session.user = null;

    // Serve the Addclient.html content
    res.sendFile(path.join(__dirname, '../frontend/Addclient.html'));
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
//html of addClient
router.get('/timesheet', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/Addclient.html'));
});


//post api to add client contact 
router.post('/api/client/contact', async (req, res) => {
  try {
    // Create a new company instance based on the request body
    const newCompany = new clientContact(req.body);

    // Save the new company to the database
    await newCompany.save();

    // Respond with a success message
    res.status(201).json({ message: 'Company created successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
router.get('/api/client/contact', async (req, res) => {
  try {
    // Fetch user data from the database
    const users = await User.find();

    // Clear the user session on the client
    req.session.user = null;

    // Serve the Addclient.html content
    res.sendFile(path.join(__dirname, '../frontend/AddClientContacts.html'));
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
//get api to fetch data all selectCompany name only
router.get("/selectcompany", async (req, res) => {
  try {
      // Find all distinct company names from the clientContact collection
      const allCompanyNames = await clientContact.distinct("selectCompany");

      // Check if any company names were found
      if (allCompanyNames.length === 0) {
          return res.json("No Company Found");
      } else {
          return res.json(allCompanyNames);
      }
  } catch (error) {F
      console.error("Error retrieving company names:", error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
});



//html of addClient contact
router.get('/timesheet', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/AddClientContacts.html'));
});



//post api to add client requirements 
router.post('/api/client/req', async (req, res) => {
  try {
    // Create a new company instance based on the request body
    const newCompany = new clientRequirement(req.body);

    // Save the new company to the database
    await newCompany.save();

    // Respond with a success message
    res.status(201).json({ message: 'Company created successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
router.get('/api/client/req', async (req, res) => {
  try {
    // Fetch user data from the database
    const users = await User.find();

    // Clear the user session on the client
    req.session.user = null;

    // Serve the Addclient.html content
    res.sendFile(path.join(__dirname, '../frontend/addrequirement.html'));
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
//html of addClient requirement
router.get('/addrequirement', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/addrequirement.html'));
});


//api for adding employee daily task
router.post('/add/tasks', async (req, res) => {
  try {
    const { taskTitle, description, addTeam, createdAt, fullName} = req.body;
    // Check if required fields are provided
    if (!taskTitle || !addTeam) {
      return res.status(400).json({ error: 'taskTitle and addTeam are required fields' });
    }
    const teamNames = addTeam.map(team => team.trim());
        // Create new task object
        const newTask = new addTask({
          taskTitle,
          description,
          addTeam: teamNames,
          fullName:fullName,
          createdAt

        });
    // Save the new task to MongoDB
    await newTask.save();
    // Return success response
    res.status(201).json({ message: 'Task created successfully', task: newTask });

  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// GET route to fetch all tasks
router.get('/add/tasks', async (req, res) => {
  try {
    // Fetch all tasks from the database
    const tasks = await addTask.find();
    // Return the tasks as JSON response
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// router.get('/add/tasks', async (req, res) => {
//   try {
//        const fullName = req.cookies.User;
//        const user = await User.findOne({ fullName });
//       if (!user) {
//           return res.status(401).json({ error: 'Unauthorized', details: 'Please log in to access this resource' });
//       }
//       const tasks = await addTask.find();
//       res.status(200).json(tasks);
//   } catch (error) {
//       console.error('Error fetching tasks:', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// });


//getall api all tasks of all teams 
router.get("/tasks",async (req,res)=>{
  try {
    const { taskTitle, addTeam } = req.query;
    let query = {};
    // Add criteria if provided
    if (taskTitle) {
      query.taskTitle = taskTitle;
    }
    if (addTeam) {
      query.addTeam = { $in: Array.isArray(addTeam) ? addTeam : [addTeam] };
    }
    // Find tasks based on criteria
    const tasks = await addTask.find(query);
   
   // Respond with HTML table
   res.status(200).send(`
   <!DOCTYPE html>
 

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <link rel="stylesheet" href="./viewupdate.css" /> 
    <title>Document</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous" />
  <link rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/css/bootstrap-select.css" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.1/js/bootstrap-select.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  </head>
  <body>
  <style>
  :root {
    --blue: #2a2185;
    --white: #fff;
    --gray: #f5f5f5;
    --black1: #222;
    --black2: #999;
}
  body {
    min-height: 100vh;
    overflow-x: hidden;
    display: flex;
  }
  .flex-column {
    position: fixed;
    width: 250px;
    height: 100%;
    background: var(--blue);
    border-left: 10px solid var(--blue);
    transition: 0.5s;
    overflow: hidden;
  }   
  .flex-column ul {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
   
  .flex-column ul li{
    position: relative;
    width: 100%;
    list-style: none;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
  }
   
  .flex-column ul li:hover,
  .flex-column ul li.hovered {
    background-color: var(--white);
  }
.flex-column .image {
    margin-top: 30px;
    margin-bottom: 20px;
    padding-left: 10px;
    padding-bottom: 10%;
}
.flex-column span{
    padding-left: 20px;
    font-size: 1.3rem;
    font-weight: 450;
    padding-top: .5rem;
}
.flex-column ul li a{
    position: relative;
    display: block;
    width: 100%;
    display: flex;
    text-decoration: none;
    color: var(--white);
}


.flex-column ul li:hover a::before,
.flex-column ul li.hovered a::before {
  content: "";
  position: absolute;
  right: 0;
  top: -50px;
  width: 50px;
  height: 50px;
  background-color: transparent;
  border-radius: 50%;
  box-shadow: 35px 35px 0 10px var(--white);
  pointer-events: none;
}
.flex-column ul li:hover a::after,
.flex-column ul li.hovered a::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: -50px;
  width: 50px;
  height: 50px;
  background-color: transparent;
  border-radius: 50%;
  box-shadow: 35px -35px 0 10px var(--white);
  pointer-events: none;
}

.login {
    padding-top: 10px;
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    margin: 10px;
}
.container {
    width: 80%;
    margin-bottom: 16%;
    font-size: large;
}

h4 {
    margin-bottom: 40px;
    text-align: center;
    padding: 10px;
}
h5{
    margin-top: 14px;
}
.buttons{
    padding-left: 29%;
    padding-top: 20px;
}
.login img{
    height: 25px;
    width: 25px;
    margin-right: 20px;
}
.openbtn {
    text-decoration: none;
    background-color: black;
    margin-left: 50px;
    font-size: 17px;
    cursor: pointer;
    color: white;
    border-radius: 5px;
  }
  .openbtn:hover {
    background-color: #444;
  }
  .top-right {
    position: fixed;
    top: 10px; /* Adjust top spacing as needed */
    right: 10px; /* Adjust right spacing as needed */
    background-color: #ffffff; /* Background color */
    padding: 5px 10px; /* Padding around the text */
    border: 1px solid #cccccc; /* Border around the element */
    border-radius: 5px; /* Rounded corners */
    font-size: 14px; /* Font size */
}
table{
    margin-left: 130px;
}
</style>
    <nav class="flex-column">
      <ul>
        <img class="image" src="https://bodhtree.com/wp-content/uploads/2016/02/logo-sticky.png" />
        <li><a href="./index.html" class="nav-link"><i class="fs-2 bi bi-house-door"></i><span>Home</span></a></li>
        <li><a href="./mydetails.html" class="nav-link"><i class="fs-2 bi bi-file-earmark-person"></i><span>My Details</span></a></li>
        <li><a href="./timesheet.html" class="nav-link"><i class="fs-2 bi bi-clock-history"></i><span>Timesheet</span></a></li>
        <li><a href="./resources.html" class="nav-link"><i class="fs-2 bi bi-gear-wide-connected"></i><span>Resources</span></a></li>
        <li><a href="#" class="nav-link"><i class="fs-2 bi bi-chat-left-text"></i><span>Forums</span></a></li>
        <li><a href="./organization.html" class="nav-link"><i class="fs-2 bi bi-diagram-3"></i><span>Organization</span></a></li>
      </ul>
    </nav>
    <div class="login" style="display: flex; justify-content: space-between; align-items: center; position: absolute; top: 10px; right: 10px;">
      <h5 id="fullNameDisplay">fullName</h5>
      <button type="button" id="logoutButton" class="btn btn-dark">Log Out</button>
  </div>
          <div class="container">
                <div class="mb-3 row">
                  <div class="col-sm-4">
            </form>
          </div>
            <table class="table">
              <h4>View Updates:</h4>
              <thead>
              <tr>
              <th>#</th>
              <th>Task Title</th>
              <th>Description</th>
              <th>Team</th>
              
            </thead>
            <tbody>
              ${tasks.map((tasks, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>
                  <a href="#" id="taskTitleDisplay" data-task-id="${tasks._id}" data-description="${tasks.description}" onClick="handleClick(event)">${tasks.taskTitle}</a>
                </td>
                <td>${tasks.description}</td>
                <td>${tasks.addTeam.join(', ')}</td>
                
                </tr>
              `).join('')}
            </tbody>
          </table>
        <script>
          const loggedInUserJSON = localStorage.getItem('loggedInUser');
        // Parse the JSON string to get the object
        const loggedInUser = JSON.parse(loggedInUserJSON);

        // Check if loggedInUser and fullName are present
        if (loggedInUser && loggedInUser.fullName) {
            // If present, update the HTML element with the full name
            document.getElementById('fullNameDisplay').textContent = loggedInUser.fullName;
        } else {
            // If not present, display a default message or handle accordingly
            document.getElementById('fullNameDisplay').textContent = 'Full name not found in localStorage';
        }
    </script>
    <script>
    document.addEventListener('DOMContentLoaded', () => {
      const taskLinks = document.querySelectorAll('.task-link');
      taskLinks.forEach(taskLink => {
          taskLink.addEventListener('click', handleClick);
      });
      async function handleClick(event) {
          event.preventDefault(); // Prevent the default link behavior
  
          const taskId = event.currentTarget.dataset.taskId;
          retrieveTaskData(taskId);
      }
      async function retrieveTaskData(taskId) {
          try {
              const response = await fetch('http://localhost:4000/taskTitlePage/taskId');
              if (response.ok) {
                  const taskData = await response.json();
                  const currentDate = new Date().toISOString();
                  // Store task title and description in sessionStorage with unique keys
                  localStorage.setItem('taskTitle_' + currentDate, taskData.taskTitle);
                  localStorage.setItem('taskDescription_' + currentDate, taskData.taskDescription);
                  // Redirect to the task title page
                  window.open('/taskTitlePage', '_blank');
              } else {
                  console.error('Error retrieving task data:', response.status, response.statusText);
              }
          } catch (error) {
              console.error('Error retrieving task data:', error);
          }
      }
  });
  // Function to handle click on task title link
function handleClick(event) {
    event.preventDefault(); // Prevent the default link behavior
    // Retrieve the task title from the link's text content
    const taskTitle = event.currentTarget.textContent.trim();
    // Retrieve the description from the link's data-description attribute
    const description = event.currentTarget.getAttribute('data-description').trim();
    // Store both task title and description in localStorage
    localStorage.setItem('selectedTaskTitle', taskTitle);
    localStorage.setItem('selectedDescription', description);
    // Redirect to the taskTitlePage
    window.location.href = '/taskTitlePage';
}
// Add click event listener to task title links
document.addEventListener('DOMContentLoaded', () => {
    const taskLinks = document.querySelectorAll('.task-link');
    taskLinks.forEach(taskLink => {
        taskLink.addEventListener('click', handleClick);
    });
});
// Code for taskTitlePage
document.addEventListener('DOMContentLoaded', () => {
    // Retrieve task title and description from localStorage
    const taskTitle = localStorage.getItem('selectedTaskTitle');
    const description = localStorage.getItem('selectedDescription');
    // Display task title and description on the page
    document.getElementById('taskTitle').textContent = taskTitle;
    document.getElementById('description').textContent = description;
});
</script>
    </body>
        </html>
       
      `);
          
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//api to add taskTitle and description and comments
router.post('/tasks/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    const { comments } = req.body;
    let task = await addTask.findOne({ _id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (!Array.isArray(task.comments)) {
      task.comments = [];
    }
    const newComments = Array.isArray(comments) ? comments : [comments];
    for (const newComment of newComments) {
      if (!newComment.text) {
        return res.status(400).json({ error: 'Text field is required for each comment' });
      }
    }
    newComments.forEach(newComment => {
      task.comments.push({ text: newComment.text, createdAt: new Date() });
    });
    task = await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment to the task' });
  }
});




// router.get('/task-details', async (req, res) => {
//   try {
//     const tasks = await addTask.find();
//     res.json(tasks);
//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/tasks/titles/_id', async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await addTask.findById(taskId).populate('comments'); // Populate the 'comments' field
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error fetching task details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//html page of teamUpdate
router.get('/teamUpdate', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/teamUpdate.html'));
});
router.get('/taskTitlePage', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/taskTitlePage.html'));
});
router.get('/add/task', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/timesheet.html'));
});

// Get a specific task by its task title
router.get('/tasks/title/:taskTitle', async (req, res) => {
  try {
    const taskTitle = req.params.taskTitle;
    const task = await addTask.findOne({ taskTitle: taskTitle });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task by title:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all task title from db
router.get('/tasks/titles', async (req, res) => {
  try {
    const tasks = await addTask.find({}, { _id: 0, taskTitle: 1 });
    if (tasks.length === 0) {
      return res.status(404).json({ error: 'No tasks found' });
    }
    res.status(200).json({ taskTitles: tasks.map(task => task.taskTitle) });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/taskTitlePage/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    // Fetch task details from the database based on the task ID
    const task = await addTask.findById(taskId);
    // Check if the task exists
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    // If the task exists, return it
    res.json(task);
  } catch (error) {
    console.error('Error fetching task details:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// router.get('/api/tasks/title/:taskTitle', async (req, res) => {
//   const taskTitle = req.params.taskTitle;
//   try {
//     const task = await addTask.findOne({ taskTitle });
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }
//     res.status(200).json({ taskTitle: taskTitle });
//   } catch (error) {
//     console.error('Error fetching task:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });



// Update an existing task with given data
router.put('/tasks/:taskTitle', async (req, res) => {
  try {
    // Find and update the task in question
    let updatedTask = await addTask.findOneAndUpdate({ taskTitle: req.params.taskTitle }, req.body, { new: true });
    // If no task was found, send an error
    if (!updatedTask) {
      return res.status(404).json({ error: "No task with that taskTitle exists." })
    }
    // Otherwise, send back the updated task
    res.status(200).json(updatedTask);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message || "A problem occurred updating the task" });
  }
});



//extrating data country,state,city
router.post('/extract-data', async (req, res) => {
  try {
    const { country, state, city } = req.body;
    // Source collection
    const sourceCollection = mongoose.connection.db.collection('addClient');
    // Destination collection
    const destinationCollection = mongoose.connection.db.collection('addClientContact');
    // Find documents matching the criteria
    const query = { country, state, city };
    const documents = await sourceCollection.find(query).toArray();

    // Check if documents array is empty
    if (documents.length === 0) {
      return res.status(400).json({ error: 'No documents found for the specified criteria' });
    }

    // Insert documents into the destination collection
    const result = await destinationCollection.insertMany(documents);
    res.status(200).json({ message: 'Data extracted successfully', insertedCount: result.insertedCount });
  } catch (error) {
    console.error('Error extracting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
