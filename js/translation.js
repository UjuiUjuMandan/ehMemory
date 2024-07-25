// URL for the compressed db.text.json file
const DB_TEXT_URL = 'https://cdn.jsdelivr.net/gh/EhTagTranslation/DatabaseReleases/db.text.json.gz';

// Function to translate data
async function translateData(data) {
    console.info('Starting data translation...');
    const translationData = await getTranslationData();

    let processedTagCount = 0;
    const logInterval = 100; // Log progress every 100 tags

    const translatedData = data.map(item => {
        item.tags = item.tags.map(tag => {
            const [namespace, tagName] = tag.split(':');

            const namespaceTranslation = translationData.data.find(ns => ns.namespace === namespace);
            if (namespaceTranslation) {
                const translatedNamespace = namespaceTranslation.namespace in namespaceTranslation.data 
                    ? namespaceTranslation.data[namespaceTranslation.namespace].name 
                    : namespace;

                const translatedTag = tagName in namespaceTranslation.data 
                    ? namespaceTranslation.data[tagName].name 
                    : tagName;

                const translatedFullTag = `${translatedNamespace}:${translatedTag}`;

                processedTagCount++;
                if (processedTagCount % logInterval === 0) {
                    console.info(`Translated ${processedTagCount} tags so far.`);
                }

                return translatedFullTag;
            } else {
                processedTagCount++;
                if (processedTagCount % logInterval === 0) {
                    console.info(`Translated ${processedTagCount} tags so far.`);
                }
                return tag;
            }
        });

        return item;
    });

    console.info('Data translation completed.');
    return translatedData;
}

// Function to fetch and decompress the JSON data
async function fetchAndCacheDBText() {
    // Check if the data is already in localStorage
    const cachedData = localStorage.getItem('dbTextData');
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    try {
        const response = await fetch(DB_TEXT_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Fetch the compressed data
        const compressedData = await response.arrayBuffer();
        const decompressedData = pako.ungzip(new Uint8Array(compressedData), { to: 'string' });
        const jsonData = JSON.parse(decompressedData);

        // Cache the data in localStorage
        localStorage.setItem('dbTextData', JSON.stringify(jsonData));

        return jsonData;
    } catch (error) {
        console.error('Error fetching or decompressing data:', error);
        throw error;
    }
}

// Function to get translation data
async function getTranslationData() {
    try {
        const data = await fetchAndCacheDBText();
        // Log only a summary of the translation data
        console.info('Translation data loaded. Namespaces available:', data.data.map(ns => ns.namespace).join(', '));
        return data;
    } catch (error) {
        console.error('Error getting translation data:', error);
    }
}
