import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import NewsForm from './NewsForm'
import NewsList from './NewsList'
import { db } from '../firebase'
import Alert from '@material-ui/lab/Alert'
import Collapse from '@material-ui/core/Collapse'

const News = () => {
  const [newsObj, setNewsObj] = useState('')
  const [currentId, setCurrentId] = useState('')
  const [newsList, setNewsList] = useState([])
  const [successAlert, setSuccessAlert] = useState(false)
  const [alertContent, setAlertContent] = useState({
    wording: "",
    color: "error"
  })

  useEffect(() => {
    db.collection("news").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          setNewsList(prevList => [...prevList, {
            id:doc.id,
            data:doc.data()
          }])
      });
    });
  }, [])

  const addOrEdit = (obj) => {
    if(currentId === '') {
      db.collection("news").add(obj)
        .then(function() {
          showAlert('Dokumen Berhasil Tersimpan', 'success')
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    } else {
      db.collection("news").doc(currentId).update(obj)
        .then(function() {
          showAlert('Dokumen Berhasil Diperbarui', 'success')
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
    }
  }

  const onEdit = (payload) => {
    setCurrentId(payload) 
    db.collection("news").doc(payload).get().then(function(doc) {
        if (doc.exists) {
          setNewsObj(doc.data())
        } else {
          console.log("No such document!");
        }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
  }

  const onDelete = (payload) => {
    db.collection("news").doc(payload).delete().then(function() {
      showAlert('Dokumen Berhasil Terhapus', 'error')
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });
  }

  const onClearField = () => {
    setCurrentId('')
  }

  function showAlert(wording, color) {
    setSuccessAlert(true)
    setAlertContent({
      wording: wording,  
      color: color
    })
    setTimeout(() => {
      setSuccessAlert(false)
      window.location.reload()
    }, 2000)
  }

  return (
    <>
      <Grid container spacing={5}>
      
      <Grid item xs={12}>
        <Collapse in={successAlert}>
          <Alert variant="filled" severity={alertContent.color} >
            {alertContent.wording}
          </Alert>
        </Collapse>
      </Grid>
      
      <Grid item xs={12} md={5}>
          <NewsForm {...({addOrEdit, newsObj, currentId, onClearField})} />
        </Grid>
        <Grid item xs={12} md={7}>
          <NewsList {...({newsObj, onEdit, onDelete, newsList})} />
        </Grid>
      </Grid>
    </>
  )
}

export default News