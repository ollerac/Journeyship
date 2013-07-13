### working on now:
- left it in a half finished state. making an animation (which should be an extension of the CanvasObject but isn't) be drawn to from the constructor canvas. it updates the first layer. need to make it so new layers can be selected and drawn to too and make these update the animation object. there's a property on every CanvasObject called selectedLayerNum which tells you the selected layer. also, i broke the preview container by making the animation's main element the constructor canvas. maybe i shouldn't do that. it could be called the `currentLayerCanvas` instead and i could draw to that element. then the main element of an animation would be the canvas element that's animating. i think that would be a good idea.


### what i *need* before launching:
- layers
  - new layer button, new layer function
  - mirror
  - add
  - remove
  - show selected
  - select
  - show previous layer
  - link with preview
  - animate preview
- save block
  - unique id (underscore)
  - add to main color palette
- be able to paint with custom boxes
- show selected color
- be able to check a box to specify a box as a background layer or a foreground object
- be able to check a box to see that last layer that you're painting over for an object
- delete objects from main board
- delete objects from main color palette
- data persistence


### would be *really* nice to have:
- a transparent color
- add journeyship logo (with sail moving)
- use version control
- speech bubbles


### would be nice to have:
- add arbitrary colors to the main color palette and the object color palette
- interaction rules
- custom animation interval





### recently finishished:
- got the animation preview working
  - new properties for CanvasObject
    - layers
    - layerIndex
  - new functions for CanvasObject
    - addLayer
    - nextLayer
    - animate
- preview updates on changing the contructor block
- backup last version and commit this new version with cruft removed

