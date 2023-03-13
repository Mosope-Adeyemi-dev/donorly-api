const verifyPasswordPolicy = async (password) => {
  // password should contain at least one lowercase, uppercase, digit, and special character
  const REQUIRED_CHARACTER_CLASSES = 4;

  const characterClasses = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    digit: /\d/,
    special: new RegExp(`[@#$%^&+=!]`),
  };

  let count = 0;

  for (const [name, regex] of Object.entries(characterClasses)) {
    if (regex.test(password)) {
      count += 1;
    }
  }

  if (count < REQUIRED_CHARACTER_CLASSES) {
    return false;
  }

  return true;
};

module.exports = verifyPasswordPolicy;
