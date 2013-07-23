### working on now:
- saving blocks from the editor area to the main color palette
  - either:
    - color palettes area going to be able to have patterns instead of colors (i.e. an array of colors in place of a color) or
    - there will be custom palettes
  - either way the main drawable area will have to be able to have animated blocks as part of its map... i think. unless there's just an array of animated blocks that get rendered every 300ms. okay, but either way the main drawable area will have to have patterns as part of its map, so that it can draw its area over and over again. and then the animated blocks should be on top of that... but wait, animated blocks should be able to be backgrounds too. some should be able to move. and some should stay stationary. make them all moveable but just let them stay stationary if they're stationary. so... layers? layers of layers of layers? where does it end?? just layers of layers. and just one layer deep. for now. and a background layer that's static. stuff in front can be static or animated. those will be animated blocks. and then there's just patterns. i can make those after i'm done adding animated blocks to the main color palette. so the main drawable area will be able to have animatedBlocks and patterns inside of its map.

### what i *need* before launching:
- layers
  - ✔ new layer button, new layer function 
  - ✔ mirror objects that watch a map-like list property and update their canvas when an update method is called
  - ✔ add
  - ✔ remove
  - show which layer is selected with an icon or something
  - ✔ ability to select a layer 
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
- made an editorArea object to manage the editing area. it creates layers and has an animatedBlock and a drawableSurface as properties.
- do a test with a bunch of animating blocks so you can see what the performance will be like and so you can see how you should organize your code
- getting drawing on the constructorBlock to update the selected layer in the sidebar and the animation (it should just update the layer map thingie and that should broadcast the changes and then they can re-render and stuff)
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

