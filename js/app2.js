/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
      console.log('Creating attendance records...');
      function getRandom() {
        return (Math.random() >= 0.5);
      }

      var nameColumns = $('tbody .name-col');
      var attendance = {};

      nameColumns.each(function() {
        var name = this.innerText;
        attendance[name] = [];

        for (var i = 0; i <= 11; i++) {
          attendance[name].push(getRandom());
        }
      });

      localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
  var model = {
    attendance: JSON.parse(localStorage.attendance),
    getAttendanceByName: function(name) {
      return localStore.attendance[name];
    },
    countMissingByName: function(name) {
      var record = this.attendance[name];
      var count = 0;
      for(var i = 0; i < record.length; i++) {
        if(!record[i]) {
          count++;
        }
      }
      return count;
    }
  }
  
  var octopus = {
    init: function() {
      view.init();
    },
    getAttendance: function() {
      return model.attendance;
    },
    updateAttendance: function(name,newAttendance) {
      model.attendance[name] = newAttendance;
    },
    getMissing: function(name) {
      return model.countMissingByName(name);
    }
  }
    
  var view = {
    init: function() {
      $allCheckboxes = $('tbody input');

      // When a checkbox is clicked, update localStorage
      $allCheckboxes.on('click', function() {
        var studentRow = $(this).closest(".student");
        var studentName = studentRow.children('.name-col').text();
        var checkBoxes = studentRow.find(':checkbox');

        var newAttendanceArray = [];
        checkBoxes.each(function() {
          newAttendanceArray.push($(this).prop('checked'));
        });

        // Save new attendance record.
        octopus.updateAttendance(studentName,newAttendanceArray);
        
        // Update new counts.
        var numMissed = octopus.getMissing(studentName);
        studentRow.children('.missed-col').text(numMissed);
      });
      
      this.render();
    },
    render: function() {
      // Check boxes, based on attendace records:
      $.each(octopus.getAttendance(), function(name, days) {
        var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr');
        var dayChecks = $(studentRow).children('.attend-col').children('input');

        dayChecks.each(function(i) {
          $(this).prop('checked', days[i]);
        });
      });
      
      // Display number of missing days:
      var allStudentRows = $('tr.student');
      allStudentRows.each(function() {
        var studentName = $(this).children('.name-col').text();
        var numMissed = octopus.getMissing(studentName);
        $(this).children('.missed-col').text(numMissed);      
      });
    } 
  };

  octopus.init();
}());
