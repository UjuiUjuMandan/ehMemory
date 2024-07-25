// Define keywords to be excluded
const excludeKeywords = [
    'sole male',
    'sole female',
    'males only',
    'females only',
		'translated',
		'rewrite'
];

// Define the mapping of options to namespaces
const namespaceMappings = {
    'Content/Fetishes': ['male', 'female', 'mixed'],
    'Technical': ['other'],
    'Languages': ['language'],
    'Characters': ['character'],
    'Artist': ['artist'],
    'Cosplayer': ['cosplayer'],
    'Parody': ['parody']
};

// Function to process tags
function processTags(data, selectedNamespaces) {
    const tagCounts = {};

    console.log('Starting tag processing...');

    // Determine which namespaces are selected
    const namespacesToInclude = selectedNamespaces.flatMap(option => namespaceMappings[option] || []);
    console.log('Namespaces to include:', namespacesToInclude);

    // Track the number of excluded tags for debugging
    let excludedTagCount = 0;

    // Iterate over each object in the array
    data.forEach((item, index) => {
        // Log the progress
        if (index % 100 === 0) { // Adjust this number based on the size of your data
            console.log(`Processing item ${index + 1}/${data.length}`);
        }

        // Iterate over each tag in the 'tags' array
        item.tags.forEach(tag => {
            // Ensure the tag is in the correct format
            if (tag.includes(':')) {
                // Extract the namespace
                const [namespace, tagName] = tag.split(':');

                // Check if the tag should be excluded
                if (!excludeKeywords.some(keyword => tag.includes(keyword)) &&
                    (namespacesToInclude.length === 0 || namespacesToInclude.includes(namespace))) {
                    tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
                } else {
                    excludedTagCount++;
                    if (excludedTagCount % 100 === 0) { // Log every 100th excluded tag
                        console.log(`Excluded ${excludedTagCount} tags so far`);
                    }
                }
            } else {
                console.warn(`Invalid tag format: ${tag}`);
            }
        });
    });

    console.log('Tag processing complete.');
    console.log('Tag counts:', tagCounts);

    return tagCounts;
}

// Function to get word cloud data
function getWordCloudData(tagCounts) {
    console.log('Generating word cloud data...');

    // Limit the number of tags to ensure readability and avoid clutter
    const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50); // Adjust the limit as needed

    // Find the maximum and minimum count
    const maxCount = Math.max(...sortedTags.map(([_, count]) => count));
    const minCount = Math.min(...sortedTags.map(([_, count]) => count));

    console.log(`Max count: ${maxCount}`);
    console.log(`Min count: ${minCount}`);

    // Generate word cloud data with normalized sizes
    const wordCloudData = sortedTags.map(([tag, count]) => ({
        text: tag,
        size: (count - minCount) / (maxCount - minCount) * 95 + 10
    }));

    console.log('Word cloud data:', wordCloudData);

    return wordCloudData;
}

// Function to get bar chart data
function getBarChartData(tagCounts) {
    console.log('Generating bar chart data...');

    const barChartData = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 25); // Adjust the limit as needed

    console.log('Bar chart data:', barChartData);

    return barChartData;
}

