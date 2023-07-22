const express = require("express");
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

const router = express.Router();

//Route 1 : get all notes of  a User using: get "/api/notes/fetchallnotes". require Auth(login).
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
});

//Route 2 : Add a new note for  a User using: post "/api/notes/addnote". require Auth(login).
router.post(
  "/addnote",
  fetchuser,
  body("title")
    .isLength({ min: 3 })
    .withMessage("Not a valid title(atleast 3 characters )"),
  body("description")
    .isLength({ min: 5 })
    .withMessage("Not a valid Description(atleast 5 characters )"),

  async (req, res) => {
    const result = validationResult(req);

    try {
      if (!result.isEmpty()) {
        res.send({ errors: result.array() });
      } else {
        const { title, description, tag } = req.body;
        const note = new Note({
          title,
          description,
          tag,
          user: req.user.id,
        });
        const savedNote = await note.save();
        res.json(savedNote);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Error: check console for details");
    }
  }
);


//Route 3 : update a  note for  a User using: put "/api/notes/updatenote". require Auth(login).

router.put(
    "/updatenote/:id",
    fetchuser,

    async (req, res) => {

  
      try {
   
          const { title, description, tag } = req.body;

          const newNote = {};
          if(title){newNote.title=title};
          if(description){newNote.description=description};
          if(tag){newNote.tag=tag};

          // find the note to be updated
        let note = await Note.findById(req.params.id);
          if(!note){res.status(404).send("not found")}

          if (note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
          }
          note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote},{new:true})  
          
          res.json(note);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Error: check console for details");
      }
    }
);

//Route 4 : delete a  note for  a User using: delete "/api/notes/deletenote". require Auth(login).

router.delete(
    "/deletenote/:id",
    fetchuser,

    async (req, res) => {

  
      try {
   
         
          // find the note to be delete
          let note = await Note.findById(req.params.id);
          if(!note){res.status(404).send("not found")}

          if (note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
          }
          note = await Note.findByIdAndDelete(req.params.id);  
          
          res.json({"Success": "Note has been deleted", note:note});
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Error: check console for details");
      }
    }
);
module.exports = router;
