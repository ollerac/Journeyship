### working on now:
- made an editorArea object to manage the editing area. it creates layers and has an animatedBlock and a drawableSurface as properties.

- FIRST PRIORITY: do a test with a bunch of animating blocks so you can see what the performance will be like and so you can see how you should organize your code
- getting drawing on the constructorBlock to update the selected layer in the sidebar and the animation (it should just update the layer map thingie and that should broadcast the changes and then they can re-render and stuff)





### what i *need* before launching:
- layers
  - new layer button, new layer function
  - mirror objects that watch a map-like list property and update their canvas when an update method is called
  - add
  - remove
  - show which layer is selected with an icon or something
  - ability to select a layer ✔
  - show previous layer on top of current layer with some transparency
  - link each layer to the preview animation
  - get the animate preview working
- save block
  - unique id (from underscore)
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
- cleaned up code
  - animation objects are primary
    - layers (each a map)
    - selected layer
  - new: DrawableSurface object replaces original CanvasObject
- got updating the animated preview to work
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

