import React, {Component} from 'react';
import Customer from './components/Customer';
import './App.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {withStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 1080
  }, 
  progress: {
    margin: theme.spacing.unit * 2
  }
})

class App extends Component {

  state = {
    customers: "",
    completed: 0 //progress 0%로부터 시작
  }

  componentDidMount(){
    //0.02초마다 progress함수가 실행
    this.timer = setInterval(this.progress, 20);
    //1. 특정뷰의 api를 비동기적으로 호출
    this.callApi() //progress test  
      //3. 돌아온 응답의 상태변화를 감지하여 뷰를 갱신
      .then(res => this.setState({customers: res}))
      .catch(err => console.log(err));
  }

  callApi = async () => {  //2. 돌아온 응답 
    const response = await fetch('/api/customers');
    const body = await response.json();
    return body;
  }

  progress =() => {
    const { completed} = this.state;
                //값이 0~100까지 왔다갔다 함. 
    this.setState({ completed: completed >= 100 ? 0 : completed + 1});
  }

  render(){
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>이미지</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>생년월일</TableCell>
              <TableCell>성별</TableCell>
              <TableCell>직업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* 4.api 응답결과
            처음엔 목록이 비워있는 상태이니 
            this.state.customers가 존재할때만 실행 */}
            {this.state.customers ? 
            this.state.customers.map(c => {
              return (
                <Customer
                  key={c.id}
                  id={c.id}
                  image={c.image}
                  name={c.name}
                  birthday={c.birthday}
                  gender={c.gender}
                  job={c.job}
                  />
              );
            }) : 
            <TableRow>
              <TableCell colspan="6" align="center">
                <CircularProgress className={classes.progress} variant="determinate" value={this.state.completed}/>
              </TableCell>
            </TableRow>
            }
          </TableBody>
        </Table>
        
        
      </Paper>
    );
  }
}
export default withStyles(styles)(App);
