# top problems
make sure you're passing arguments in the right order to your functions, especially after you add new arguments
make sure your "this" refers to what you think it does
  - when you create an object, you can't use `this` to refer to another property from within a new property unless it's in a function. you can put it inside a function or have both properties refer to a variable outside the object.


# html5 data attributes
mydiv.getAttribute("data-color")
mydiv.setAttribute("data-color", "orange")
mydiv.removeAttribute("data-color")