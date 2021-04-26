import React from 'react'; 
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container'; 
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select'; 
import MenuItem from '@material-ui/core/MenuItem';
import { useTracker } from 'meteor/react-meteor-data';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';  


function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs };
}
function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '80%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const rows = [
  createData('Frozen yoghurt', 159, 6.0,  2),
  createData('Ice cream sandwich', 237, 9.0, 37),
  createData('Eclair', 262, 16.0, 24),
  createData('Cupcake', 305, 3.7, 67),
  createData('Gingerbread', 356, 16.0, 49),
];
export default function Admin() {
  
  // Basic hooks
  const [currentUser, setCurrentUser] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [modalStyle] = React.useState(getModalStyle);

  
  // Getting default data
  const classes = useStyles(); 
  const users = useTracker(() => {
    return Meteor.users.find({}).fetch(); 
  });

  const roles = useTracker(() => {
      return Meteor.roles.find({ _id : { $in: [ 'admin', 'editor', 'user' ] } }).fetch();
  });  
  
  // Tracking data changes
  React.useEffect(() => {
    console.log('hey')
      if (users.length > 0 && currentUser == 0) {
        setCurrentUser(users[0]._id?users[0]._id:'');
      }
  });

  // Handling user changes
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (status) => {
    if(status){
      setOpen(false);
    }
  };

  const handleChange = (event) => {
    setCurrentUser(event.target.value);
  };

  handlePermissionChange = (_id, permission, status) => { 
      Meteor.call('removePermission', {_id:_id, permission:permission, status:status})
  }

  return (
    <div>
        <Container fixed>
          <FormControl style={{marginTop:'20px', width:'50%'}}> 
            <Select
              labelId="current-user-label"
              id="current-user"
              value={currentUser}
              onChange={handleChange}
            >  
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>{user.profile.name}</MenuItem> 
              ))}
            </Select>
          </FormControl>
          {Roles.userIsInRole(currentUser, 'add') && 
            <Button variant="contained" color="primary" style={{margin:'20px 0px',float:'right'}}>Add New</Button>
          }
          <Button variant="contained" onClick={handleOpen}   style={{margin:'20px 10px', float:'right'}}>Manage Roles</Button>
          {Roles.userIsInRole(currentUser, 'view') &&
              <TableContainer component={Paper} style={{marginTop:'50px'}}>
              <Table style={{minWidth: 650}} aria-label="simple table">
                <TableHead style={{backgroundColor:'lightgray'}}>
                  <TableRow>
                    <TableCell>Dessert (100g serving)</TableCell>
                    <TableCell align="center">Calories</TableCell>
                    <TableCell align="center">Fat&nbsp;(g)</TableCell>
                    <TableCell align="center">Carbs&nbsp;(g)</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="center">{row.calories}</TableCell>
                      <TableCell align="center">{row.fat}</TableCell>
                      <TableCell align="center">{row.carbs}</TableCell>
                      <TableCell align="center">
                        {Roles.userIsInRole(currentUser, 'edit') &&
                          <Button variant="contained" color="primary" style={{marginRight:'10px'}}>Edit</Button> 
                        } 
                        {Roles.userIsInRole(currentUser, 'delete') &&
                          <Button variant="contained" color="secondary" > Delete </Button>
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          }

      
      <Modal
        open={open}
        onClose={() => handleClose(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}> 
            <Container fixed>
                <h3>Role Manager </h3>
                
                <TableContainer component={Paper} style={{marginTop:'20px'}}>
                <Table style={{minWidth: 650}} aria-label="simple table">
                    <TableHead style={{backgroundColor:'lightgray'}}>
                    <TableRow>
                        <TableCell>Role</TableCell>
                        <TableCell align="center">Add</TableCell>
                        <TableCell align="center">Edit</TableCell>
                        <TableCell align="center">Delete</TableCell>
                        <TableCell align="center">View</TableCell> 
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {roles.map((row) => (
                         
                        <TableRow key={row._id}>
                        <TableCell component="th" scope="row">
                            {row._id}
                        </TableCell>
                         <TableCell align="center">
                            <FormControlLabel
                                control={
                                <Checkbox 
                                    checked={row.children.some(permission => permission._id == 'add')}
                                    onChange={() => handlePermissionChange(row._id, 'add', row.children.some(permission => permission._id == 'add'))}
                                    name="checkedB"
                                    color="primary"
                                />
                                } 
                            />                            
                        </TableCell>
                        <TableCell align="center">
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={row.children.some(permission => permission._id == 'edit')}
                                    onChange={() => handlePermissionChange(row._id, 'edit', row.children.some(permission => permission._id == 'edit'))}
                                    name="checkedB"
                                    color="primary"
                                />
                                } 
                            /> 
                        </TableCell>
                        <TableCell align="center">
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={row.children.some(permission => permission._id == 'delete')}
                                    onChange={() => handlePermissionChange(row._id, 'delete', row.children.some(permission => permission._id == 'delete'))}
                                    name="checkedB"
                                    color="primary"
                                />
                                } 
                            /> 
                        </TableCell>
                        <TableCell align="center">
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={row.children.some(permission => permission._id == 'view')}
                                    onChange={() => handlePermissionChange(row._id, 'view', row.children.some(permission => permission._id == 'view'))}
                                    name="checkedB"
                                    color="primary"
                                />
                                } 
                            /> 
                        </TableCell>  
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>

                <Button onClick={() => handleClose(true)} variant="contained" color="primary" style={{marginTop:'10px', float:'right'}}>Save</Button>               
            </Container>
        </div>  
      </Modal>
      </Container>
    </div>
  )
}
