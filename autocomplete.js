//"config" object being passed into this function will contain custom functions
// where we put all references to movies/recipes/etc and how they should be rendered
//this function is completely reusable, all you have to do is pass in appropriate different
// properies, where to render it to (root), how to show individual item(renderOption),
// what to do when someone clicks (onOptionSelect), what to backfll inside the input
// when someone clicks(inputValue), how to fetch data (fetchData)
const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  //root element encapsulates everything contained in autocomplete
  root.innerHTML = `
  <label><b>Search</b></label>
    <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>    
`;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  //we initially defined fetchData as an async function, so we need to add 'await'
  // to fetchData here in order to retun results and not just a promise
  const onInput = async (event) => {
    //fetch data, then ---v
    const items = await fetchData(event.target.value);
    //after deleting a search, and there's no input in search, do not run rest of code
    //if there are no movies found, don't resume code
    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }
    //should clear out any previous data displayed in dropdown menu so that
    //newest results don't simply get appended at the bottom of results
    resultsWrapper.innerHTML = "";
    //open up drop down menu
    dropdown.classList.add("is-active");
    //then add all movies to it
    for (let item of items) {
      //create anchors
      const option = document.createElement("a");
      //error handling to make sure there is a poster available to display
      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);
      //when selected movie is clicked, the drop down menu is removed
      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
      });

      resultsWrapper.appendChild(option);
    }
  };

  input.addEventListener("input", debounce(onInput, 500));

  //if user clicks outside of root (autocomplete widget), then close dropdown menu
  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
