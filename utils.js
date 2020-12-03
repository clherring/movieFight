//debounce function forces a function to wait a certain amount of time before
// running again; the function is built to limit the number of times a function
// is called
const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      //apply will keep track of how many arguments we pass through
      func.apply(null, args);
    }, delay);
  };
};
