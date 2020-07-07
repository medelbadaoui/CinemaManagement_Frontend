import React, { useEffect, useState } from 'react'
import { Col, Menu } from 'antd'
import { getVille } from '../services/cinemaService';


const Villes =(props)=>{
    const handleClick = props.handleClick
    const villes = props.villes
    
    return (
        <div>
            <center>
                <h2>
                Ville
                </h2>
            </center>
            
            <center>
                {
                    villes.length>0?
                        <Menu
                        onClick={handleClick}
                        style={{ width: 256 }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        >
                           
                           {
                                villes.map((ville,index)=>{
                                    return (
                                        <Menu.Item key={index+1}>{ville.name}</Menu.Item>
                                    )
                                })
                            }
                        </Menu>
                        :
                        ""
                }
                
            </center>
        </div>
    )
}

export default Villes