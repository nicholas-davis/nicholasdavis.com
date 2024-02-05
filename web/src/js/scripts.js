//
// scripts.js
//

const observeStickyElement = () => {
    let elements = document.querySelectorAll('.stickyTop');

    function handleResize() {
        // Check window width and toggle 'sticky-top' class
        if (window.innerWidth >= 992) {
            elements.forEach(element => {
                element.classList.add('sticky-top', 'pt-sm-5');
            });
        } else {
            elements.forEach(element => {
                element.classList.remove('sticky-top', 'pt-sm-5');
            });
        }
    }

    // Initial call to set the class based on the window width
    handleResize();

    // Attach the function to the window resize event
    window.addEventListener('resize', handleResize);
}

// Call the function to observe and modify elements
observeStickyElement();


















// const downloadResumeFile = () => {
//     // Get the button element
//     const downloadButton = document.querySelector('button[data-url]');
//     // Get the URL from the data-url attribute of the button
//     const downloadUrl = downloadButton.getAttribute('data-url');
//     // Fetch the file contents as a Blob
//     fetch(downloadUrl)
//         .then(response => response.blob())
//         .then(blob => {
//             // Create a temporary URL for the Blob
//             const blobUrl = URL.createObjectURL(blob);
//             // Create a link element
//             const downloadLink = document.createElement('a');
//             // Set the download link's href attribute to the Blob URL
//             downloadLink.href = blobUrl;
//             // Extract the filename from the URL
//             const downloadFilename = downloadUrl.split('/').pop();
//             // Set the download link's download attribute to the extracted filename
//             downloadLink.download = downloadFilename;
//             // Append the download link to the document
//             document.body.appendChild(downloadLink);
//             // Trigger a click event on the download link to initiate the download
//             downloadLink.click();
//             // Remove the download link from the document
//             document.body.removeChild(downloadLink);
//             // Revoke the Blob URL to free up memory
//             URL.revokeObjectURL(blobUrl);
//         })
//         .catch(error => {
//             console.error('Error fetching file:', error);
//         });
// }

// window.downloadResumeFile = downloadResumeFile;