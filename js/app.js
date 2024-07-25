// 从 localStorage 读取当前语言，如果没有则默认是英文
let currentLanguage = localStorage.getItem('currentLanguage') || 'en';

// 加载数据的函数
function loadData() {
    console.log('Loading data...');
    const fileInput = document.getElementById('fileInput');
    const urlInput = document.getElementById('urlInput');
    const selectedNamespaces = Array.from(document.querySelectorAll('.filters input[type="checkbox"]:checked')).map(cb => cb.value);
    console.log('Selected namespaces:', selectedNamespaces);

    // 将选中的命名空间存储到 localStorage
    localStorage.setItem('selectedNamespaces', JSON.stringify(selectedNamespaces));

    if (fileInput.files.length > 0) {
        // 从文件输入中加载数据
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                console.log('Data loaded from file:', data);
                processAndTranslateData(data, selectedNamespaces);

                // 将加载的数据存储到 localStorage
                sessionStorage.setItem('lastLoadedData', JSON.stringify(data));
            } catch (e) {
                alert('Error parsing JSON file.');
                console.error('Error parsing JSON file:', e);
            }
        };

        reader.readAsText(file);
    } else if (urlInput.value) {
        // 从 URL 输入中加载数据
        fetch(urlInput.value)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Data loaded from URL:', data);
                processAndTranslateData(data, selectedNamespaces);

                // 将加载的数据存储到 sessionStorage
                sessionStorage.setItem('lastLoadedData', JSON.stringify(data));
                localStorage.setItem('lastLoadedURL', urlInput.value);
            })
            .catch(error => {
                alert('Error fetching data from URL.');
                console.error('Fetch error:', error);
            });
    } else {
        alert('Please provide either a file or a URL.');
    }
}

// 处理并翻译数据的函数
async function processAndTranslateData(data, selectedNamespaces) {
    console.log('Processing and translating data...');

    if (currentLanguage === 'zh') {
        try {
            const translationData = await getTranslationData();
            translateData(data, translationData).then(translatedData => {
                console.log('Translated data:', translatedData);
                const tagCounts = processTags(translatedData, selectedNamespaces);
                const wordCloudData = getWordCloudData(tagCounts);
                const barChartData = getBarChartData(tagCounts);

                createWordCloud(wordCloudData);
                createBarChart(barChartData);
            }).catch(error => {
                console.error('Error translating data:', error);
            });
        } catch (error) {
            console.error('Error getting translation data:', error);
        }
    } else {
        const tagCounts = processTags(data, selectedNamespaces);
        const wordCloudData = getWordCloudData(tagCounts);
        const barChartData = getBarChartData(tagCounts);

        createWordCloud(wordCloudData);
        createBarChart(barChartData);
    }
}

// 切换语言的函数
function toggleLanguage() {
    currentLanguage = (currentLanguage === 'en') ? 'zh' : 'en';
    document.getElementById('toggleLanguageButton').innerText = (currentLanguage === 'en') ? '切换到中文' : 'Switch to English';
    console.log('Language toggled to:', currentLanguage);

    // 将当前语言存储到 localStorage
    localStorage.setItem('currentLanguage', currentLanguage);
}

// 添加事件监听器
document.addEventListener('DOMContentLoaded', () => {
    const loadButton = document.getElementById('loadDataButton');
    if (loadButton) {
        loadButton.addEventListener('click', loadData);
    }

    const toggleLanguageButton = document.getElementById('toggleLanguageButton');
    if (toggleLanguageButton) {
        toggleLanguageButton.addEventListener('click', toggleLanguage);

        // 根据当前语言设置按钮文本
        toggleLanguageButton.innerText = (currentLanguage === 'en') ? '切换到中文' : 'Switch to English';
    }

    // 读取并应用上次加载的 URL
    const lastLoadedURL = localStorage.getItem('lastLoadedURL');
    if (lastLoadedURL) {
        document.getElementById('urlInput').value = lastLoadedURL;
    }

    // 如果有之前加载的数据和选中的命名空间，则加载它们
    const lastLoadedData = sessionStorage.getItem('lastLoadedData');
    const selectedNamespaces = JSON.parse(localStorage.getItem('selectedNamespaces')) || [];

    // 设置复选框的选中状态
    document.querySelectorAll('.filters input[type="checkbox"]').forEach(checkbox => {
        if (selectedNamespaces.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });

    if (lastLoadedData) {
        try {
            const data = JSON.parse(lastLoadedData);
            console.log('Loading last loaded data from localStorage:', data);
            processAndTranslateData(data, selectedNamespaces);
        } catch (e) {
            console.error('Error parsing last loaded data from localStorage:', e);
        }
    }
});

