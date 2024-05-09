

document.getElementById('employeeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const formData = {
      employeeSeries: document.getElementById('employeeSeries').value,
      probationPeriod: document.getElementById('probationPeriod').value,
      enterCode: document.getElementById('employeeNo').value,
      confirmationDate: document.getElementById('conformation').value,
      fullName: document.getElementById('fullName').value,
      officeEmail: document.getElementById('officeMail').value,
      dateOfBirth: document.getElementById('dob').value,
      mobileNo: document.getElementById('number').value,
      gender: document.getElementById('genderLabel').value,
      reportsTo: document.getElementById('manager').value,
      dateOfJoining: document.getElementById('doj').value,
      status: document.getElementById('status').value,
      division: document.getElementById('division').value,
      costCenter: document.getElementById('costCenter').value,
      Grade: document.getElementById('grade').value,
      designation: document.getElementById('designation').value,
      Location: document.getElementById('location').value,
      department: document.getElementById('department').value,
      Shift: document.getElementById('shift').value,
      holidayCategory: document.getElementById('holidayCat').value,
      company: document.getElementById('bloodGroup').value,
      physicalChallenged: document.getElementById('physicalChallenged').value,
      nationality: document.getElementById('nation').value,
      maritalStatus: document.getElementById('maritalStatus').value,
      spouseName: document.getElementById('spouseName').value,
      native: document.getElementById('native').value,
      address: document.getElementById('residential').value,
      fathersName: document.getElementById('fatherName').value,
      emergencyContactNumber: document.getElementById('emgNo').value,
      emergencyContactName: document.getElementById('emgName').value,
      aadharNumber: document.getElementById('aadhar').value,
      panNumber: document.getElementById('pan').value,
      pfNumber: document.getElementById('pf').value,
      uanNumber: document.getElementById('uan').value,
      
    };
  
    try {
      const response = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Response from server:', responseData); 
      } else {
        console.error('Failed to submit form data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  });
  