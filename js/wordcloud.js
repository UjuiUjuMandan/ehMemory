function createWordCloud(wordCloudData) {
    if (wordCloudData.length > 0) {
        // Create word cloud
        WordCloud(document.getElementById('wordCloud'), {
            list: wordCloudData.map(item => [item.text, item.size]),
            weightFactor: 2, // Adjust weight factor to improve layout
            color: 'random-light',
            backgroundColor: '#f0f0f0',
            rotateRatio: 0, // Adjust rotation ratio
            shape: 'square', // Set the shape to 'square'
            minSize: 5, // Minimum font size
            gridSize: 8, // Adjust grid size
            drawOutOfBound: false // Avoid drawing outside canvas
        });
    } else {
        alert('No valid tag data to display.');
    }
}

