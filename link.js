// // Actual data for the form fields
// const userData = {
//     firstName: "John",
//     lastName: "Doe",
//     Designation: "Engineer",
//     Department: "IT",
//     reportsTo: "Manager",
//     dateOfJoining: "2022-01-01",
//     workType: "Full-time",
//     annual_ctc: "80000",
//     officeEmail: "john.doe@example.com",
//     workLocation: "Office City",
//     mobileNo: 1234567890,
//     personal_Email: "john.personal@example.com",
//     gender: "Male",
//     native: "City",
//     enterCode: "ABC123",
//     enterPassword: "securepassword",
//   };
  
//   fetch('http://localhost:8000/api/users', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(userData),
//   })
//     .then(response => response.json())
//     .then(data => {
//       console.log('API response:', data);
//       // Handle success, redirect, or update UI as needed
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       // Handle error, show user a message, etc.
//     });
  



    function createUser() {
      const userForm = document.getElementById('userForm');
      const formData = new FormData(userForm);

      fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      })
        .then(response => response.json())
        .then(data => {
          console.log('API response:', data);
          // Handle success, redirect, or update UI as needed
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle error, show user a message, etc.
        });
    }
  


    