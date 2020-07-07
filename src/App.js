import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css';
import { Row, Col, Layout, Menu, Tabs, Card, Select, Avatar, Divider, Button, Input } from 'antd';
import Villes from './componnent/villes';
import { getVille, getCenima ,getSalles,getProjection,host,getTicketPlace,reservePlace} from './services/cinemaService';
import Form from 'antd/lib/form/Form';
const { TabPane } = Tabs;
const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;
const  App=()=> {
 
  const callback= async(key)=> {
    setCinema(cinemas[key])
    setCurrentCinema(key+"")
    const s = await getSalles({cinema:cinemas[key]});
    setSalles([...s])
    
  }
  const handleClick = async e => {
    const c = await getCenima({ville:villes[0]});
    setCinemas([...c])
    const s = await getSalles({cinema:c[0]});
    setSalles([...s])
    
    setCurrentCinema(0+"")
    console.log('click ', e);
};

  useEffect(()=>{
    const initData =async()=>{
      const v = await getVille();
      setVilles([...v]);
      const c =await getCenima({ville:v[0]});
      setCinemas([...c]);
      setCinema(c[0])
      const s = await getSalles({cinema:c[0]});
      setSalles([...s]);
      
      
    }
    initData()
  },[])
  const [villes , setVilles]=useState([])
  const [cinemas , setCinemas]=useState([])
  const [salles , setSalles]=useState([])
  const [cinema , setCinema]=useState()
  const [currentCinema ,setCurrentCinema]=useState(0+"")
  return (
    <div>
       <Layout>
      <Header>Header</Header>
      <Content>
        <div style={{height:25}}></div>
          <Row gutter={[16,16]}>
            <Col style={{}} span={5} offset={2} >
              <Villes villes = {villes} handleClick={handleClick}/>
            </Col>
            
            <Col style={{}} span={15}>
              <Cinemas cinemas={cinemas} callback={callback} currentCinema={currentCinema}/>
              {
                cinema&&salles?<Salles cinema ={cinema} salles ={salles}/>:""
              }
              
              
            
            </Col>
          </Row>
      </Content>
      <Footer>Footer</Footer>
    </Layout>
      
    </div>
  );
}
const Cinemas =(props)=>{

  const cinemas = props.cinemas
  const callback=props.callback
  const currentCinema = props.currentCinema
  useEffect(()=>{
  },[])
  return(
    <div>
        {
          cinemas.length>0?
            <Tabs activeKey={currentCinema} onChange={callback}>
              {
                cinemas.map((cinema,index)=>{
                  return (
                      <TabPane tab={cinema.name} key={index} >
                      
                      </TabPane>
                  )
                })
              }
                
                
            </Tabs>
            :
            ""
        }
    </div>
  )
}
const Salles=(props)=>{
  const cinema = props.cinema
  const salles = props.salles
  const [salle , setSalle]=useState(salles[0])
  const [selectKey , setSelectKey]=useState(0)
  const handleChange=(value)=>{
    console.log(value); // { key: "lucy", label: "Lucy (101)" }
    setSalle(salles[value.key])
    setSelectKey(value.key)
  }
  useEffect(()=>{
    
  },[])
  useEffect(()=>{
    setSalle(salles[0])
    setSelectKey(0)
  },[cinema])
  return(
    <div>
      
        {
          salles?
          
          <div >
            <Row gutter={[16,16]} >
              {
                salles.map(salle=>{
                  return (
                    <Col span={12}>
                        <Projection salle = {salle}/>
                    </Col>
                  )
                })
              }
            </Row>
              
          </div>
                 
                      
                        
           
            
          :"" 
        }
        
        
      
    </div>
  )
}
const Projection =(props)=>{
  const salle = props.salle
  useEffect(()=>{
    getProjection({salle}).then(pro =>{
      setProjection(pro)
      console.log(pro._embedded.projections[0].film.title)
    } )
    setTickets()
    console.log(salle)
  },[salle])
  const [projection , setProjection]=useState()
  const [tickets , setTickets]=useState()
  const getTickerts =(proj)=>{
    getTicketPlace({proj}).then(tickets=>{
      setTickets(tickets)
    })
    
  }
  const reserve=(props)=>{

      reservePlace({...props,tickets:props.clickedTickets.map(place=> place.id)}).then(tickets=>{
        console.log("ahmed")
        getProjection({salle}).then(pro =>{
          setProjection(pro)
          console.log(pro._embedded.projections[0].film.title)
        } )
        setTickets()
      })
  }

  return(
    <div>
      {
        projection?
          <div >
              <Card  title={`${salle.name} : ${projection._embedded.projections[0].film.titre}`} bordered={false} style={{ width: "100%" }}>
                <Row>
                  <Col  span={10}>
                    <img height="250px" width='140px' src={`${host}/imageFilm/${projection._embedded.projections[0].film.id}`} shape="square" size={200} />
                  </Col>
                  <Col offset={0} span={14}>
                    <center><h3>Séances</h3></center>
                    <ul>
                      
                    {
                      projection._embedded.projections.map((proj,index)=>{
                        const date = new Date(proj.seance.heureDebut)
                      console.log()
                        return(
                          <div>
                            <li style={{cursor:"pointer"}} onClick={()=>getTickerts(proj)} >
                            {`${date.getHours()}h ${date.getMinutes()} min => Price : ${proj.prix} DH`}
                          </li>
                          </div>
                        )
                      })
                    }
                    </ul>
                  </Col>
                </Row>
                <Place reserve={reserve}  tickets={tickets}/>
              </Card>
                  
                    
                
            
            
            

          </div>
          :""
      }
    </div>
    
    
  )
}
const Place =(props)=>{
  const tickets = props.tickets
  const reserve = props.reserve
  const [clickedTickets,setClickedtickets] = useState([])
  const [name,setName] = useState()
  const [codePaiement,setCodePaiement] = useState()
  const toggleReserve=(place)=>{
    const i = clickedTickets.indexOf(place)
    if(i<0)
    {
      setClickedtickets([...clickedTickets,place])
    }else
    
    setClickedtickets([...clickedTickets.slice(0,i),...clickedTickets.slice(i+1,clickedTickets.length)])
  }
  useEffect(()=>{
        console.log(tickets)
        setClickedtickets([])
  },[tickets])

  return (
    <div >
      <div style={{height:10}}>
        
      </div>
      <div>
      {
        tickets?
          <Row gutter={[16,8]}>
            {
              tickets._embedded.tickets.map(ticket=>{
                
                return(
                    <Col span={3}>
                      <Button disabled={ticket.reservee} type={clickedTickets.includes(ticket)?"primary":"default"} onClick={()=>toggleReserve(ticket)} >
                        <center>{ticket.place.numero}</center>
                      </Button>
                      </Col>
                    
                  
                )
              })
            }
            
          </Row>:""
          
      }
      </div>
      <div>
        {
          clickedTickets.length>0?
          <div>
            <Col>
            <div>
              <Input placeholder="Client name" value={name} onChange={(event)=>setName(event.target.value)}/>
              </div>
              <div>
              <Input placeholder="Paiement code" value={codePaiement} onChange={(event)=>setCodePaiement(event.target.value)}/>
              </div>
              <div style={{float:"right"}}>
                <Button type="primary" onClick={()=>{reserve({clickedTickets,name,codePaiement});setName("");setCodePaiement("");}}>Reserve</Button>
              </div>
            </Col>
          </div>
          :""
        }
      </div>
      
      
    </div>
  )
}
export default App;
