const generateRandomHex = () => {
  const randomHex = Math.floor(Math.random() * 0x10000).toString(16);
  return randomHex.padStart(4, "0");
};

module.exports = { generateRandomHex };
