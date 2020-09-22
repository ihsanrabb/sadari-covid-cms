import React, {useState} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.primary.dark ,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  // table: {
  //   minWidth: 700,
  // },
  tableContainer: {
    marginTop: '5rem'
  },
  margin: {
    marginRight: '.5rem'
  }
});


const NewsList = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [localId, setLocalId] = useState('')

  const handleClickOpen = (id) => {
    setOpen(true);
    setLocalId(id)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    setOpen(false);
    props.onDelete(localId)
  }

  return (
    <>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
            
            {props.newsList.map((news) => (
              <StyledTableRow key={news.id}>
                <StyledTableCell component="th" scope="row">
                  {news.data.title}
                </StyledTableCell>
                <StyledTableCell>
                  {news.data.date}
                </StyledTableCell>
                <StyledTableCell>
                  <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Fab 
                      size="small" 
                      color="primary" 
                      aria-label="add" 
                      className={classes.margin}
                      onClick={() => props.onEdit(news.id)}
                    >
                      <EditIcon />
                    </Fab>
                    <Fab 
                      size="small" 
                      color="secondary" 
                      aria-label="add" 
                      className={classes.margin}
                      onClick={() => handleClickOpen(news.id)}  
                    >
                      <DeleteIcon />
                    </Fab>
                  </Grid>
                </StyledTableCell>
              </StyledTableRow>
            ))}

          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure Delete this News?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once you delete you can't retreate the data
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default NewsList