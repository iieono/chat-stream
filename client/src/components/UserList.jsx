import React, { useEffect, useState } from 'react'
import { Avatar, useChatContext } from 'stream-chat-react'

import { InviteIcon } from '../assets'

function ListContainer({ children }) {
  return (
    <div className='user-list__container'>
        <div className='user-list__header'>
            <p>User</p>
            <p>Invite</p>
        </div>
        { children }
    </div>
  )
}

function UserItem({ user, setSelectedUsers }) {
    const [selected, setSelected] = useState(false)
    const handleSelect = () =>{
        if(selected){
            setSelectedUsers((state)=> state.filter((user)=> user != user.id ))
        }else{
            setSelectedUsers((state) => [...state, user.id])
        }

        setSelected((state) => !state)
    }
  return (
    <div className='user-item__wrapper' onClick={handleSelect}>
        <div className='user-item__name-wrapper'>
            <Avatar image={user.image} name={user.fullName || user.id} size={32} />
            <p className='user-item__name'>{user.fullName || user.id}</p>
        </div>
        { selected ?  
        <InviteIcon /> :
        <div className='user-item__invite-empty' />
        }
    </div>
  )
}

function UserList({setSelectedUsers }) {
    const { client } = useChatContext()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [listEmpty, setListEmpty] = useState(false)
    const [error, setError] = useState(false)

    useEffect(()=>{
        const getUsers = async()=>{
            if(loading) return
            setLoading(true)

            try{
                const response = await client.queryUsers(
                    { id : {$ne : client.userID} },
                    { id : 1 },
                    { limit : 8 }
                )
                if(response.users.length){
                    setUsers(response.users)
                }else{
                    setListEmpty(true)
                }
            }catch(err){
                setError(true)
            }
            setLoading(false)
        }

        if(client) getUsers()
    },[])

    if(error){
        return(
            <ListContainer>
                <div className='user-list__message'>
                    Error loading, please refresh and try again!
                </div>
            </ListContainer>
        )
    }
    if(listEmpty){
        return(
            <ListContainer>
                <div className='user-list__message'>
                    No users found.
                </div>
            </ListContainer>
        )
    }

  return (
    <ListContainer>
        {loading ? <div className='user-list__message'>Loading Users...</div>
        : (
            users?.map((user, idx)=> (
                <UserItem index={idx} key={user.id} user={user} setSelectedUsers={setSelectedUsers} />
            ))
        )
    }
    </ListContainer>
  )
}

export default UserList