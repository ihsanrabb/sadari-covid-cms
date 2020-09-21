import React, {useState, useEffect} from 'react';
import Grid from '@material-ui/core/Grid';
import NewsForm from './NewsForm'
import NewsList from './NewsList'
import firebaseDB from '../firebase'

const News = () => {
  const [newsObj, setNewsObj] = useState({})

  useEffect(() => {
    // firebaseDB.child('news').on('value', snapshot => {
    //   if(snapshot.val() !== null) {
    //     setNewsObj  ({
    //       ...snapshot.val()
    //     })
    //   }
    // })
  }, [newsObj])

  const addOrEdit = (obj) => {
    console.log('submit parent', obj)
    firebaseDB.child('news').push(
      obj,
      err => {
        if(err) {
          console.log(err)
        }
      }
    )
  }
  return (
    <>
      <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
          <NewsForm addOrEdit={addOrEdit} />
        </Grid>
        <Grid item xs={12} md={6}>
          <NewsList />
        </Grid>
      </Grid>
    </>
  )
}

export default News