const requestsInput = document.getElementById("requests");
const headInput = document.getElementById("head");
const algorithmInput = document.getElementById('algorithm');
const diskSizeInput = document.getElementById("diskSize");
const directionInput = document.getElementById("direction");
const runBtn = document.getElementById("runBtn");
const resetBtn = document.getElementById("resetBtn");
const results = document.getElementById("results");
const compareBtn = document.getElementById("compareBtn");

runBtn.addEventListener("click", function(){
    const requests = requestsInput.value.split(",").map(value => Number(value.trim()));
    const head =Number(headInput.value);
    const algorithm = algorithmInput.value;
    const diskSize = Number(diskSizeInput.value);
    if(requestsInput.value.trim() === "" || headInput.value.trim() === "" ||diskSizeInput.value.trim() === "" || algorithm === ""){
        alert("Please Fill all required fields!");
        return;
    }
if(!Number.isInteger(head)||!Number.isInteger(diskSize)|| diskSize <=0){
    alert("Enter valid head position and disk size!");
    return;
}
if(requests.some(value => !Number.isInteger(value))){
    alert("Enter valid disk requests");
    return;

}
  if (
        head < 0 || head >= diskSize ||
        requests.some(value => value < 0 || value >= diskSize)
    ) {
        alert("Cylinder values must be within disk size!");
        return;
    }
 if (algorithm === "FCFS") {

        const result = fcfs(requests, head);

        results.innerHTML = `
            <h3>FCFS Results</h3>

            <p>
                Head Movement Sequence:
                ${result.sequence.join(" → ")}
            </p>

            <p>
                Total Head Movement:
                ${result.totalMovement}
            </p>
        `;

    }
    
else if (algorithm === "SSTF") {

    const result = sstf(requests, head);

    results.innerHTML = `

        <h3>SSTF Results</h3>

        <p>
            Head Movement Sequence:
            ${result.sequence.join(" → ")}
        </p>

        <p>
            Total Head Movement:
            ${result.totalMovement}
        </p>

    `;

}

else if (algorithm === "SCAN") {

    const direction = directionInput.value;

    if (direction === "") {

        alert("Please select direction!");

        return;

    }

    const result = scan(
        requests,
        head,
        diskSize,
        direction
    );

    results.innerHTML = `

        <h3>SCAN Results</h3>

        <p>
            Head Movement Sequence:
            ${result.sequence.join(" → ")}
        </p>

        <p>
            Total Head Movement:
            ${result.totalMovement}
        </p>

    `;

}

else if (algorithm === "CSCAN") {

    const direction = directionInput.value;

    if (direction === "") {

        alert("Please select direction!");

        return;

    }

    const result = cscan(
        requests,
        head,
        diskSize,
        direction
    );

    results.innerHTML = `

        <h3>C-SCAN Results</h3>

        <p>
            Head Movement Sequence:
            ${result.sequence.join(" → ")}
        </p>

        <p>
            Total Head Movement:
            ${result.totalMovement}
        </p>

    `;

}

else if (algorithm === "LOOK") {

    const direction = directionInput.value;

    if (direction === "") {

        alert("Please select direction!");

        return;

    }

    const result = look(
        requests,
        head,
        direction
    );

    results.innerHTML = `

        <h3>LOOK Results</h3>

        <p>
            Head Movement Sequence:
            ${result.sequence.join(" → ")}
        </p>

        <p>
            Total Head Movement:
            ${result.totalMovement}
        </p>

    `;

}

else if (algorithm === "CLOOK") {

    const direction = directionInput.value;

    if (direction === "") {

        alert("Please select direction!");

        return;

    }

    const result = clook(
        requests,
        head,
        direction
    );

    results.innerHTML = `

        <h3>C-LOOK Results</h3>

        <p>
            Head Movement Sequence:
            ${result.sequence.join(" → ")}
        </p>

        <p>
            Total Head Movement:
            ${result.totalMovement}
        </p>

    `;

}


 
    else {

        results.innerHTML =
            "<p>This algorithm will be implemented soon.</p>";

    }

});




resetBtn.addEventListener("click", function () {

    requestsInput.value = "";

    headInput.value = "";

    algorithmInput.value = "";

    diskSizeInput.value = "";

    directionInput.value = "";

    results.innerHTML = "<p>Results will appear here after simulation.</p>";

});
function fcfs(requests,head){
    let totalMovement =0;
    let sequence = [head];
    let currentHead = head;
    for ( let i = 0; i< requests.length;i++){
        let distance = Math.abs(requests[i] - currentHead);
        totalMovement = totalMovement + distance;
        currentHead = requests[i];
        sequence.push(currentHead);
    }
    return{
        sequence: sequence,
        totalMovement: totalMovement
    };
}

function sstf(requests, head) {

    let pending = [...requests];

    let sequence = [head];

    let totalMovement = 0;

    let currentHead = head;

    while (pending.length > 0) {

        let nearestIndex = 0;

        let minimumDistance = Math.abs(
            pending[0] - currentHead
        );

        // Find nearest request

        for (let i = 1; i < pending.length; i++) {

            let distance = Math.abs(
                pending[i] - currentHead
            );

            if (distance < minimumDistance) {

                minimumDistance = distance;

                nearestIndex = i;

            }

        }

        // Execute nearest request

        let nextRequest = pending[nearestIndex];

        totalMovement += minimumDistance;

        currentHead = nextRequest;

        sequence.push(currentHead);

        // Remove completed request

        pending.splice(nearestIndex, 1);

    }

    return {
        sequence: sequence,
        totalMovement: totalMovement
    };

}


function scan(requests, head, diskSize, direction) {

    let left = [];

    let right = [];

    let sequence = [head];

    let totalMovement = 0;

    // Separate requests into left and right

    for (let i = 0; i < requests.length; i++) {

        if (requests[i] < head) {

            left.push(requests[i]);

        } else if (requests[i] > head) {

            right.push(requests[i]);

        }

    }

    // Sort requests

    left.sort((a, b) => b - a);

    right.sort((a, b) => a - b);


    let currentHead = head;


    // Move Right First

    if (direction === "right") {

        for (let i = 0; i < right.length; i++) {

            totalMovement += Math.abs(right[i] - currentHead);

            currentHead = right[i];

            sequence.push(currentHead);

        }

        // Reach disk end

        if (currentHead !== diskSize - 1) {

            totalMovement += Math.abs((diskSize - 1) - currentHead);

            currentHead = diskSize - 1;

            sequence.push(currentHead);

        }

        // Reverse direction

        for (let i = 0; i < left.length; i++) {

            totalMovement += Math.abs(left[i] - currentHead);

            currentHead = left[i];

            sequence.push(currentHead);

        }

    }


    // Move Left First

    else {

        for (let i = 0; i < left.length; i++) {

            totalMovement += Math.abs(left[i] - currentHead);

            currentHead = left[i];

            sequence.push(currentHead);

        }

        // Reach disk beginning

        if (currentHead !== 0) {

            totalMovement += currentHead;

            currentHead = 0;

            sequence.push(currentHead);

        }

        // Reverse direction

        for (let i = 0; i < right.length; i++) {

            totalMovement += Math.abs(right[i] - currentHead);

            currentHead = right[i];

            sequence.push(currentHead);

        }

    }


    return {

        sequence: sequence,

        totalMovement: totalMovement

    };

}

function cscan(requests, head, diskSize, direction) {

    let left = [];

    let right = [];

    let sequence = [head];

    let totalMovement = 0;

    let currentHead = head;

    // Divide requests into left and right

    for (let i = 0; i < requests.length; i++) {

        if (requests[i] < head) {

            left.push(requests[i]);

        } else if (requests[i] > head) {

            right.push(requests[i]);

        }

    }

    // Sort requests

    left.sort((a, b) => a - b);

    right.sort((a, b) => a - b);


    if (direction === "right") {

        // Execute right side requests

        for (let i = 0; i < right.length; i++) {

            totalMovement += Math.abs(right[i] - currentHead);

            currentHead = right[i];

            sequence.push(currentHead);

        }

        // Move to disk end

        if (currentHead !== diskSize - 1) {

            totalMovement += (diskSize - 1) - currentHead;

            currentHead = diskSize - 1;

            sequence.push(currentHead);

        }

        // Circular jump to beginning

        if (currentHead !== 0) {

            totalMovement += diskSize - 1;

            currentHead = 0;

            sequence.push(currentHead);

        }

        // Execute remaining left side requests

        for (let i = 0; i < left.length; i++) {

            totalMovement += left[i] - currentHead;

            currentHead = left[i];

            sequence.push(currentHead);

        }

    }


    else {

        // Execute left side requests in descending order

        left.sort((a, b) => b - a);

        for (let i = 0; i < left.length; i++) {

            totalMovement += currentHead - left[i];

            currentHead = left[i];

            sequence.push(currentHead);

        }

        // Move to disk beginning

        if (currentHead !== 0) {

            totalMovement += currentHead;

            currentHead = 0;

            sequence.push(currentHead);

        }

        // Circular jump to disk end

        if (currentHead !== diskSize - 1) {

            totalMovement += diskSize - 1;

            currentHead = diskSize - 1;

            sequence.push(currentHead);

        }

        // Execute remaining right side requests in descending order

        for (let i = right.length - 1; i >= 0; i--) {

            totalMovement += currentHead - right[i];

            currentHead = right[i];

            sequence.push(currentHead);

        }

    }


    return {

        sequence: sequence,

        totalMovement: totalMovement

    };

}

function look(requests, head, direction) {

    let left = [];

    let right = [];

    let sequence = [head];

    let totalMovement = 0;

    let currentHead = head;

    // Divide requests into left and right

    for (let i = 0; i < requests.length; i++) {

        if (requests[i] < head) {

            left.push(requests[i]);

        } else if (requests[i] > head) {

            right.push(requests[i]);

        }

    }

    // Sort requests

    left.sort((a, b) => b - a);

    right.sort((a, b) => a - b);


    // Move Right First

    if (direction === "right") {

        // Execute right side requests

        for (let i = 0; i < right.length; i++) {

            totalMovement += Math.abs(right[i] - currentHead);

            currentHead = right[i];

            sequence.push(currentHead);

        }

        // Reverse and execute left requests

        for (let i = 0; i < left.length; i++) {

            totalMovement += Math.abs(left[i] - currentHead);

            currentHead = left[i];

            sequence.push(currentHead);

        }

    }


    // Move Left First

    else {

        // Execute left side requests

        for (let i = 0; i < left.length; i++) {

            totalMovement += Math.abs(left[i] - currentHead);

            currentHead = left[i];

            sequence.push(currentHead);

        }

        // Reverse and execute right requests

        for (let i = 0; i < right.length; i++) {

            totalMovement += Math.abs(right[i] - currentHead);

            currentHead = right[i];

            sequence.push(currentHead);

        }

    }


    return {

        sequence: sequence,

        totalMovement: totalMovement

    };

}

function clook(requests, head, direction) {

    let left = [];

    let right = [];

    let sequence = [head];

    let totalMovement = 0;

    let currentHead = head;

    // Divide requests into left and right

    for (let i = 0; i < requests.length; i++) {

        if (requests[i] < head) {

            left.push(requests[i]);

        } else if (requests[i] > head) {

            right.push(requests[i]);

        }

    }

    // Sort requests

    left.sort((a, b) => a - b);

    right.sort((a, b) => a - b);


    // Move Right First

    if (direction === "right") {

        // Execute right side requests

        for (let i = 0; i < right.length; i++) {

            totalMovement += Math.abs(
                right[i] - currentHead
            );

            currentHead = right[i];

            sequence.push(currentHead);

        }

        // Circular jump to smallest left request

        for (let i = 0; i < left.length; i++) {

            totalMovement += Math.abs(
                left[i] - currentHead
            );

            currentHead = left[i];

            sequence.push(currentHead);

        }

    }


    // Move Left First

    else {

        // Execute left side requests in descending order

        for (let i = left.length - 1; i >= 0; i--) {

            totalMovement += Math.abs(
                left[i] - currentHead
            );

            currentHead = left[i];

            sequence.push(currentHead);

        }

        // Circular jump to largest right request

        for (let i = right.length - 1; i >= 0; i--) {

            totalMovement += Math.abs(
                right[i] - currentHead
            );

            currentHead = right[i];

            sequence.push(currentHead);

        }

    }


    return {

        sequence: sequence,

        totalMovement: totalMovement

    };

}
function compareAlgorithms(requests, head, diskSize, direction) {

    const results = {
        "FCFS": fcfs(requests, head),
        "SSTF": sstf(requests, head),
        "SCAN": scan(requests, head, diskSize, direction),
        "C-SCAN": cscan(requests, head, diskSize, direction),
        "LOOK": look(requests, head, direction),
        "C-LOOK": clook(requests, head, direction)
    };

    let minimumMovement = Math.min(
        ...Object.values(results).map(
            result => result.totalMovement
        )
    );

    let bestAlgorithms = Object.keys(results).filter(
        algorithm =>
            results[algorithm].totalMovement === minimumMovement
    );

    return {
        results: results,
        bestAlgorithms: bestAlgorithms,
        minimumMovement: minimumMovement
    };
}

compareBtn.addEventListener("click", function () {

    const requests = requestsInput.value
        .split(",")
        .map(value => Number(value.trim()));

    const head = Number(headInput.value);
    const diskSize = Number(diskSizeInput.value);
    const direction = directionInput.value;

    if (
        requestsInput.value.trim() === "" ||
        headInput.value === "" ||
        diskSizeInput.value === "" ||
        direction === ""
    ) {
        results.innerHTML = "<p>Please fill all required inputs.</p>";
        return;
    }

    const comparison = compareAlgorithms(
        requests,
        head,
        diskSize,
        direction
    );

    let output = "<h2>Algorithm Comparison</h2>";

    output += "<table border='1' cellpadding='10'>";
    output += `
        <tr>
            <th>Algorithm</th>
            <th>Total Head Movement</th>
        </tr>
    `;

    for (let algorithm in comparison.results) {
        output += `
            <tr>
                <td>${algorithm}</td>
                <td>${comparison.results[algorithm].totalMovement}</td>
            </tr>
        `;
    }

    output += "</table>";

    output += `
        <h3>Best Algorithm: ${comparison.bestAlgorithms.join(", ")}</h3>
        <p>Minimum Head Movement: ${comparison.minimumMovement}</p>
    `;

    results.innerHTML = output;
});