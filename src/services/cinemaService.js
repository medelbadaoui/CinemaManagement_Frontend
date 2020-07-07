import Axios from "axios"

export const host = 'http://localhost:8080'
export const getVille=async (props)=>{
    console.log("get villes")
    const res = await Axios.get(`${host}/villes`)
    return res.data._embedded.villes
}
export const getCenima=async (props)=>{
    console.log("get cinemas")
    const res = await Axios.get(props.ville._links.cinemas.href)
    return res.data._embedded.cinemas
}


export const getSalles=async (props)=>{
    console.log("get salles")
    const res = await Axios.get(props.cinema._links.salles.href)
    return res.data._embedded.salles
}
export const getProjection=async (props)=>{
    let url = props.salle._links.projections.href
    url = url.replace("{?projection}","")
    console.log("get projection  : " + url+"?projection=p1")
    const res = await Axios.get(url+"?projection=p1 ")
    return res.data
}
export const getTicketPlace=async (props)=>{
    let url = props.proj._links.tickets.href
    url = url.replace("{?projection}","")
    console.log("get projection  : " + url+"?projection=ticketProj")
    const res = await Axios.get(url+"?projection=ticketProj ")
    return res.data
}
export const reservePlace=async (props)=>{
    
     const res = await Axios.post(`${host}/payerTickets`,{
        nameClient:props.name,
        codePaiement:props.codePaiement,
        tickets:props.tickets

    }) 
    return res.data
}