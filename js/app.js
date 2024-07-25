function loadData() {
    const fileInput = document.getElementById('fileInput');
    const urlInput = document.getElementById('urlInput');
    const selectedNamespaces = Array.from(document.querySelectorAll('.filters input[type="checkbox"]:checked')).map(cb => cb.value);

    if (fileInput.files.length > 0) {
        // Load data from file input
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                const tagCounts = processTags(data, selectedNamespaces);
                const wordCloudData = getWordCloudData(tagCounts);
                const barChartData = getBarChartData(tagCounts);

                createWordCloud(wordCloudData);
                createBarChart(barChartData);
            } catch (e) {
                alert('Error parsing JSON file.');
                console.error('Error parsing JSON file:', e);
            }
        };

        reader.readAsText(file);
    } else if (urlInput.value) {
        // Load data from URL input
        fetch(urlInput.value)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const tagCounts = processTags(data, selectedNamespaces);
                const wordCloudData = getWordCloudData(tagCounts);
                const barChartData = getBarChartData(tagCounts);

                createWordCloud(wordCloudData);
                createBarChart(barChartData);
            })
            .catch(error => {
                alert('Error fetching data from URL.');
                console.error('Fetch error:', error);
            });
    } else {
        alert('Please provide either a file or a URL.');
    }
}

// Add event listener to the button
document.addEventListener('DOMContentLoaded', () => {
    const loadButton = document.querySelector('button');
    if (loadButton) {
        loadButton.addEventListener('click', loadData);
    }
});
