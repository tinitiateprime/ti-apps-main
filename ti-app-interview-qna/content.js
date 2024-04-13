fetch('/ti-app-interview-qna/content')
.then(response => response.json())
        .then(data => {
            createTable(data.contents)
        });
    
async function createTable(data) {
    const container = document.getElementById('card-container');

for (let i = 0; i < data.length; i += 3) {
    // Create a card deck or a card group
    const cardGroup = document.createElement('div');
    cardGroup.className = 'card-group mb-3';

    // Add up to 3 elements per group
    for (let j = i; j < i + 3 && j < data.length; j++) {
        const card = document.createElement('div');
        card.className = 'card';

        // Create an <a> tag to wrap the card content
        const cardLink = document.createElement('a');
        cardLink.href = "/ti-app-interview-qna/index1.html";  // Replace "#" with your desired URL, can be dynamic based on data[j]
        cardLink.className = 'stretched-link'; // Bootstrap class to make the link cover the entire card

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const cardText = document.createElement('p');
        cardText.className = 'card-text';
        cardText.textContent = data[j];
        cardText.style.cursor = "pointer";

        // Handle the click event on the card text
        cardText.onclick = function(event) {
            event.preventDefault(); // Prevent the default anchor link behavior
            cellClicked(this.textContent); // Execute your custom function
           // window.location.href = cardLink.href; 
        };

        cardBody.appendChild(cardText);
        cardLink.appendChild(cardBody);
        card.appendChild(cardBody);
        cardGroup.appendChild(card);
    }

    // Append the card group to the container
    container.appendChild(cardGroup);
}

}



function cellClicked(cellValue) {
    localStorage.setItem('getqna',cellValue );
    window.location.href="/ti-app-interview-qna/index1.html" 
       }
