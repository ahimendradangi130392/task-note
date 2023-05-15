import React, { useState, useEffect } from 'react';
import './App.css';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function App() {
  const [open, setOpen] = React.useState(false);
  const [noteData, setNoteData] = useState([]);
  const [formValue, setFormValue] = useState({
    note: "",
    body: "",
    date: new Date()
  });
  const [searchValue, setSearchValue]=useState('')
  const [updateValue, setUpdateValye] = useState();
  const [updateIndex, setUpdateIndex] = useState();
  const [showCreateButton, setShowCreateButton] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  const [sortDate, setSortDate] = useState(true);

  useEffect(() => {
    getNoteData();
  }, []);

  const getNoteData = () => {
    const notadata = localStorage.getItem("Data");
    setNoteData(JSON.parse(notadata));
  }
  const CreateNote = () => {
    setUpdateValye();
    setShowCreateButton(true);
    setShowUpdateButton(false);
    setOpen(true);
  };

  const UpdateNote = (itemNotes, index) => {

    setFormValue(itemNotes);
    setUpdateIndex(index)
    setShowUpdateButton(true);
    setShowCreateButton(false);
    setOpen(true);
  };

  const handleClose = () => {
    setUpdateValye();
    setOpen(false);
  };

  const handleChange = (event) => {

    const { name, value } = event.target;
    setFormValue((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  // save the note

  const saveNoteData = () => {
    var array = JSON.parse(localStorage.getItem('Data') || '[]');
    array.push(formValue);
    localStorage.setItem('Data', JSON.stringify(array));
    setOpen(false);
    getNoteData();
  }

  // update the note
  
  const updateNoteData = () => {
    //updateIndex
    let updateState = [...noteData]
    updateState[updateIndex] = formValue
    setNoteData(updateState);
    localStorage.setItem('Data', JSON.stringify(updateState));
    setOpen(false);
    getNoteData();

  }

  // delete the Note
  const deleteNoteData = (noteIndex) => {

    let devicesArray = JSON.parse(localStorage.getItem("Data"))
    devicesArray.splice(devicesArray.indexOf(noteIndex), 1)
    localStorage.setItem("Data", JSON.stringify(devicesArray));

    setShowCreateButton(false);
    setShowUpdateButton(false);
    setUpdateValye();
    getNoteData();
  }

  const SortingByDate = () => {
    console.log('sortDate', sortDate)
    if (sortDate) {
      let sortdate = noteData.sort((a, b) => a.date.localeCompare(b.date));
      setNoteData(sortdate);
      setSortDate(false)

    } else {
      let sortdate = noteData.sort((a, b) => b.date.localeCompare(a.date));
      setNoteData(sortdate);
      setSortDate(true)
    }

  }

  const searchHandleChange = (event) => {
    setSearchValue(event.target.value)
    const searchData = noteData.filter(value => value.note.toLowerCase().includes(event.target.value.toLowerCase()))
    setNoteData(searchData) 
  }
  return (
    <div className="App">
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={CreateNote}>Create Note</Button>
      </Stack>
      <Typography className='noteContent'> Sort By Date: <Button variant="contained" onClick={SortingByDate}>Asc/desc</Button></Typography>

      <div style={{ display: 'flex', marginTop: '15px' }}>
        <Typography className='noteContent'> Search Title:</Typography>
        <TextField
          type='search'
          id="demo-helper-text-aligned-no-helper"
          style={{ width: "350px", marginTop: '6px', marginLeft: '5px' }}
          value={searchValue}
          name={'note'}
          onChange={searchHandleChange}
        />
      </div>

      <div>
        <Box
          sx={{
            flexWrap: 'wrap',
            paddingTop: '30px',
            marginBottom: '15px',
            cursor: 'pointer',
            '& > :not(style)': {
              m: 1,
              width: "100%",
              height: 200,
            },
          }}
        >
          {noteData?.map((itemNotes, index) => (
            <Paper elevation={0} key={index}>
              <Typography className='noteContent'>Action:
                <Button className='update-button' variant="contained" onClick={(e) => UpdateNote(itemNotes, index)} >Update</Button>
                <Button className='update-button' variant="contained" onClick={(e) => deleteNoteData(index)} >Delete</Button>
              </Typography>
              <Typography className='noteContent'>Title: {itemNotes?.note}</Typography>
              <Typography className='noteContent'>Body:{itemNotes?.body}</Typography>
              <Typography className='noteContent'>Date:{itemNotes?.date}</Typography>
            </Paper>
          ))}
        </Box>

      </div>
      {/* modal */}
      <div>
        <Modal
          open={open}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box
            sx={{ ...style, width: 400, '& > :not(style)': { m: 1, width: '25ch' }, }}
            noValidate
            autoComplete="off"
          >
            <div style={{ display: 'flex' }}>
              <h2 id="parent-modal-title">Create Note</h2>
              <CloseIcon onClick={handleClose} style={{ cursor: 'pointer', width: "20px", margin: 'auto' }} />
            </div>
            <TextField
              helperText=" "
              id="demo-helper-text-aligned-no-helper"
              label="Create Note"
              style={{ width: "350px" }}
              value={formValue?.note}
              name={'note'}
              onChange={handleChange}
            />
            <TextField
              id="outlined-multiline-static"
              label="Body"
              multiline
              rows={4}
              style={{ width: "350px" }}
              value={formValue?.body}
              name={"body"}
              onChange={handleChange}
            />
            {showCreateButton && <Button variant="contained" onClick={saveNoteData} >Create Not</Button>}
            {showUpdateButton && <Button variant="contained" onClick={updateNoteData} >Update Note</Button>}
          </Box>
        </Modal>
      </div>

    </div>
  );
}

export default App;
