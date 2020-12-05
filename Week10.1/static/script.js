// on load, bind the button for posting
document.addEventListener("DOMContentLoaded", bindSubmitBtns);

function bindSubmitBtns() {
    console.log("Buttons bound")
    document
        .getElementById("submitButton")
        .addEventListener("click", function (event) {
            // prevents page refresh on content load
            event.preventDefault();
            
            var req = new XMLHttpRequest();
                
            var name = document.getElementById("name").value;
            var reps = document.getElementById("reps").value;
            var weight = document.getElementById("weight").value;
            var date = document.getElementById("date").value;
            var lbs = 0;
            // Check for radio results
            document.getElementsByName('units').forEach(radio => {
                // if the value is checked, 
                if (radio.checked==true) {
                    // console.log(radio.value);
                    lbs = radio.value
                    // set the display value to lbs or kg 
                    // if (radio.value == 1){
                    //     lbs = "kg"
                    // } else { 
                    //     lbs = "lbs"
                    // }
                }
            })
            
            //http://localhost:10292/insert?name=benson&reps=30&weight=10&date=1900&lbs=1
            
            console.log("Data Sent to url: ")
            console.log("name: " + name)
            console.log("reps: " + reps)
            console.log("weight: " + weight)
            console.log("date: " + date)
            console.log("lbs: " + lbs)

            req.open (
                "GET", 
                "http://localhost:10292/"
                + "insert?" + 
                "name=" + name + "&"+
                "reps=" + reps + "&"+
                "weight=" + weight + "&"+
                "date=" + date + "&"+
                "lbs=" + lbs,
                true
            )

            req.addEventListener("load", function () {
                if (req.status >= 200 && req.status < 400) {
                    console.log("Sent get correctly");
                } else {
                    console.log("Error during GET request: " + req.statusText);
                }
            });
            // Send only has content for POST
            req.send(null);
    })

    // Submit edit --------
    document
        .getElementById("submitEdit")
        .addEventListener("click", function (event) {
            // prevents page refresh on content load
            event.preventDefault();
            
            var req = new XMLHttpRequest();
            
            var id = document.getElementById("id").value;
            var name = document.getElementById("name").value;
            var reps = document.getElementById("reps").value;
            var weight = document.getElementById("weight").value;
            var date = document.getElementById("date").value;
            var lbs = 0
            document.getElementsByName('units').forEach(radio => {
                if (radio.checked) {
                    // console.log(radio.value);
                    lbs = radio.value
                }
            })
            // var lbs = document.getElementById("lbs").value;

            req.open (
                "GET", 
                "http://localhost:10292/"
                + "update?" + 
                "id=" + id + "&" +
                "name=" + name + "&"+
                "reps=" + reps + "&"+
                "weight=" + weight + "&"+
                "date=" + date + "&"+
                "lbs=" + lbs,
                true
            )

            req.addEventListener("load", function () {
                if (req.status >= 200 && req.status < 400) {
                    console.log("Data Sent to url: ")
                    console.log("name: " + name)
                    console.log("reps: " + reps)
                    console.log("weight: " + weight)
                    console.log("date: " + date)
                    console.log("lbs: " + lbs)
                    console.log("Sent get correctly");

                } else {
                    console.log("Error during GET request: " + req.statusText);
                }
            });
            // Send only has content for POST
            req.send(null);
    })
}

function deleteRow(rowId) {
    var req = new XMLHttpRequest();
    var id = rowId

    console.log("Pressed delete button on element...")
    req.open (
        "GET", 
        "http://localhost:10292/"
        + "delete?" + "id=" + id,
        true
    )
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            console.log("Delete correctly");

        } else {
            console.log("Error during GET request: " + req.statusText);
        }
    });
    req.send(null);
}


function editRow(rowId, name, reps, weight, date, lbs) {
    console.log(rowId);
    console.log(name);
    console.log(reps);
    console.log(weight);
    console.log(date);
    console.log(lbs);
    
    document.getElementById("id").value = rowId
    document.getElementById("name").value = name
    document.getElementById("reps").value = reps
    document.getElementById("weight").value = weight
    document.getElementById("date").value = date
    document.getElementsByName('units').forEach(radio => {
                if (radio.checked) {
                    // console.log(radio.value);
                     radio.value = lbs
                }
            })
};
    // event.preventDefault();
    
    // var req = new XMLHttpRequest();

    // http://localhost:10292/update?id=2&name=benson&reps=0&weight=0&date=0&lbs=0
    // console.log("Pressed delete button on element...")
    
    // safe-update?id=1&name=The+Task&done=false

    // req.open(
    //     "GET", 
    //     "http://localhost:10292/" + "update?" + 
    //     "id=" + rowId + "&" + 
    //     "name=" + name + "&" + 
    //     "reps=" + reps + "&" + 
    //     "weight=" + weight + "&" + 
    //     "date=" + date + "&" + 
    //     "lbs=" + lbs, 
    //     true
    // )

    // req.addEventListener("load", function() {
    //     if (req.status >= 200 && req.status < 400) {
    //         console.log("Edited correctly"); 
    //     } else {
    //         console.log("Error during edit GET request: " + req.statusText);
    //     }
    // });
    // req.send(null);