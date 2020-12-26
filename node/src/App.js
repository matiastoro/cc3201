import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Paper from '@material-ui/core/Paper';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import TextField from '@material-ui/core/TextField';
import request from 'superagent'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
})

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: '100%'
  },
  margin: {
    margin: theme.spacing(1),
  },
  table: {
    minWidth: 650,
  },
}));


const Results = React.memo(function Results(props){
  const classes = useStyles();
  const {loading, result} = props
  return (<div>
    {loading?'Cargando...':
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Apellido Paterno</TableCell>
                    <TableCell>Apellido Materno</TableCell>
                    <TableCell align="right">Mes</TableCell>
                    <TableCell align="right">Año</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.map((row,i) => (
                    <TableRow key={i}>
                      {[...Array(row.length).keys()].map((col,j) => (
                        <TableCell key={i+"-"+j} align={col>2?"right":"left"}>{row[col]?row[col]:''}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>}
    </div>
    )
})

function App() {
  const classes = useStyles();
  const [query, setQuery] = useState("");
  const [userRequest, setUserRequest] = useState({loading: false, result: []});

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event) => {
    if(event.key == 'Enter'){
      setUserRequest({loading: true, result:[]})
    }
  }

  const submit = () => {
    setUserRequest({loading: true, result:[]})
  }

  useEffect(() => {
    
    if(userRequest.loading){
      request.get('/search').query({ query: query})
      .on('error', () => {
        alert('O no! hubo un error!')
      })
      .then(res => {
        setUserRequest({loading: false, result: res.body})
      });  
    } else{
    
    }
  }, [userRequest]);

  
  const maxCols = userRequest.result.reduce((acc, row) => {
    if(row.length>acc) return row.length 
    else return acc
  }, 0)
  
  
  return (
    <div className="App">
      <div className="App-header">
        <MuiThemeProvider theme={theme}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                Remuneraciones Universidad de Chile
              </Typography>
            </Toolbar>
          </AppBar>
          <div style={{margin: 8}}>
            <Paper style={{marginTop:16, padding: 16}}>
              
              <div style={{display: "flex"}}>
                <div style={{flex: "1 1 auto"}}>  
                  <TextField id="query" label="Escriba algún apellido" fullWidth value={query} onKeyDown={handleKeyDown} onChange={handleChange}/>
                </div>
                <div style={{flex: "0 0 100px"}}>
                  <Button variant="contained" color="primary" size="medium" className={classes.margin} onClick={submit}>
                    Buscar
                  </Button>
                </div>
              </div>
              
            </Paper>
            <div style={{marginTop: 32, marginBottom: 16}}>
              Resultados
            </div>
            <Results loading={userRequest.loading} result={userRequest.result} />
            
          </div>
          
        </MuiThemeProvider>
      </div>
    </div>
  );
}

export default App;

