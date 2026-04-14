// nft-generator.js

// Function to create a Canvas image representing a random rare animal NFT
function createRareAnimalNFT() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    // Generate random colors for the animal
    const r = Math.random() * 255;
    const g = Math.random() * 255;
    const b = Math.random() * 255;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw a simple representation of an animal
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Rare Animal', 20, 50);

    return canvas.toDataURL(); // Return the image as a base64 string
}

// Generate 10,000 NFTs
const nftCollection = [];
for (let i = 0; i < 10000; i++) {
    const image = createRareAnimalNFT();
    nftCollection.push({id: i + 1, image: image});
}

// Store NFTs in localStorage
localStorage.setItem('rareAnimalNFTs', JSON.stringify(nftCollection));

// List special Tiger NFT for sale
const specialNFT = {id: 'Special-Tiger', image: createRareAnimalNFT(), price: 0.3};
console.log('Special Tiger NFT listed for sale at', specialNFT.price, 'ETH');

// Add special NFT to local storage or Server if necessary
localStorage.setItem('specialTigerNFT', JSON.stringify(specialNFT));
