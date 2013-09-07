// Define the tour!
var tour = {
  id: "welcome-tour",
  showPrevButton: true,
  steps: [
    {
      title: "Welcome to JourneyShip!",
      content: "Hello! You've come to a website where you can draw little pixelated animations and then share them online. I hope you enjoy taking a look around.",
      target: "site-title",
      placement: "bottom"
    },
    {
      title: "This is the main canvas!",
      content: "This is where you'll be able to draw your animations!",
      target: "main-area",
      placement: "top"
    },
    {
      title: "This button is how you create a new animated block!",
      content: "If you click it a brand new blank canvas will appear right below this color palette. Click it now before continuing to the next step!",
      target: "new-block",
      placement: "top"
    },
    {
      title: "This is where your new animated blocks will appear!",
      content: "If you created a new one it should be the last block in this series.",
      target: "main-color-palette",
      placement: "bottom"
    },
    {
      title: "This is the main editor area!",
      content: "This is where you can draw new animations to add to the canvas above.",
      target: "constructor-area-container",
      placement: "top"
    },
    {
      title: "This is the color palette!",
      content: "Try selecting a color and then click on the editor area to draw. You can hold down your mouse and drag in order to draw more smoothly!",
      target: "constructor-color-palette",
      placement: "left"
    },
    {
      title: "Click this \"Update\" button to save your animated block!",
      content: "After you click it you'll see it update the block in the main color palette above.",
      target: "save-block",
      placement: "right"
    },
    {
      title: "Select one of these blocks in order to start drawing!",
      content: "You'll be able to paint with it on the main canvas above. Just click on it and then click on the main canvas.",
      target: "main-color-palette",
      placement: "top"
    },
    {
      title: "This button lets you switch between the foreground layer and the background layer!",
      content: "There are two layers on this canvas, one in front and one in back. Characters and animals and other things that move around should be put on the foreground layer, while buildings and scenery should be placed on the background layer.",
      target: "bg-fg-switch",
      placement: "left"
    },
    {
      title: "Try drawing on the main canvas!",
      content: "Note: If you see a checkered pattern show through that means the canvas is transparent in that area. Try filling it in with a solid color and then switch to the foreground layer and try painting again with the same block.",
      target: "main-area",
      placement: "top"
    },
    {
      title: "The save button!",
      content: "No matter what don't forget to save your work! After you've saved you can copy the web address in your url bar in order to share your creation with other people!",
      target: "save",
      placement: "bottom"
    },
    {
      title: "The new button!",
      content: "If you want to start over from scratch just click this button...but remember to save your work first if you don't want to lose it!",
      target: "new",
      placement: "bottom"
    },
    {
      title: "Use this \"Select\" button to select any block on the main canvas below!",
      content: "When you click this button it'll turn gray to show you it's active. Then you can click anywhere on the canvas below and it will select that square. Pay *special* attention to whether you have the background layer or the foreground layer active.",
      target: "select-block-from-main-canvas",
      placement: "right"
    },
    {
      title: "The button next to the select button is the edit button!",
      content: "This button shows up after you've selected a square. It's a super powerful button because it lets you edit *any* block on the canvas, whether it's on the background layer or the foreground layer!",
      target: "select-block-from-main-canvas",
      placement: "bottom"
    },
    {
      title: "How about we get down to business and create an animation?",
      content: "Let's start by selecting one of the animated blocks from below or by just clicking the new button.",
      target: "main-color-palette",
      placement: "top"
    },
    {
      title: "This \"New Layer\" button will allow you to create a simple animation",
      content: "Click it and then try drawing on the editor area to the right.",
      target: "new-layer",
      placement: "top"
    },
    {
      title: "Now you've got your first animation!",
      content: "You can see the animation cycle through the layers you just created in this little preview box. Try creating some more layers on your own.",
      target: "preview-container",
      placement: "right"
    },
    {
      title: "You can also make a copy of the selected layer.",
      content: "If you want to make a new layer based on a previous layer, select the layer you want to copy by clicking on it and then click this \"Copy Layer\" button. Copied layers make it easier to create detailed animated blocks that look like they're moving.",
      target: "copy-layer",
      placement: "right"
    },
    {
      title: "Don't like a layer?",
      content: "Click this \"Delete Layer\" button if you feel like removing a layer from your animation. First, select the layer by clicking on it and then press this button. Be careful, there's no undo!",
      target: "delete-layer",
      placement: "right"
    },
    {
      title: "Want to see the previous layers more easily?",
      content: "Click this checkbox if you want to make the top layer a little transparent so you can see what's going on on the layers that come before it.",
      target: "enable-shadow",
      placement: "bottom"
    },
    {
      title: "Here's a secret!",
      content: "If you really like an animated block that you created in another project go to that project and click this \"Export\" button. It will generate a web address that you can copy and paste into another project's \"Import\" box.",
      target: "export-editor-block",
      placement: "left"
    },
    {
      title: "Click the \"Import\" link in order to get see the import box",
      content: "Paste the web address you got in the previous step (after clicking \"Export\") and then click the \"Import Editor Area\" button. Then it'll load up that animated block right here!",
      target: "import-editor-block",
      placement: "left"
    },
    {
      title: "Enjoy!!! That's it for the tour!",
      content: "I hope you have a fun time creating lots of animations and drawings! Please send me an email if you have any questions or comments: <a href='mailto:david@storylog.com'>david@storylog.com</a>",
      target: "site-title",
      placement: "bottom"
    },
    {
      title: "And don't forget to save!",
      content: "It's important!",
      target: "save",
      placement: "bottom"
    }
  ]
};