import React, { useState } from 'react'
import {Button,Modal,Form as BootstrapForm} from 'react-bootstrap'
import { useAddNewUserMutation } from '../../slices/adminApiSlice'
import { toast } from 'react-toastify'


export const RegisterModal = ({showModal,closeModal,refetchData}) => {
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

    const [addUserByAdmin] = useAddNewUserMutation()

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!name || !email || !password) {
          toast.error('All fields are required');
          return;
        }

        const nameRegex = /^[a-zA-Z]{3,}$/;
        if (!nameRegex.test(name)) {
          toast.error('Please enter a valid name');
          return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          toast.error('Please enter a valid email address');
          return;
        }
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters long');
          return;
        }
        try {
        const responseFromApiCall = await addUserByAdmin({
            name,
            email,
            password
        }).unwrap()
        toast.success('User Added Successfully')
        closeModal()
        refetchData()
    } catch (err) {
        toast.error(err?.data?.message || err?.error);
    }
    }


  return (
<Modal show={showModal} onHide={closeModal}>
<Modal.Header closeButton>
  <Modal.Title>Register New User</Modal.Title>
</Modal.Header>
<Modal.Body>
  <BootstrapForm>
    <BootstrapForm.Group controlId="name">
      <BootstrapForm.Label>Name</BootstrapForm.Label>
      <BootstrapForm.Control
        type="text"
        value={name}
        onChange={(e) =>
            setName(e.target.value)
        }
      />
    </BootstrapForm.Group>
    <BootstrapForm.Group controlId="email">
      <BootstrapForm.Label>Email</BootstrapForm.Label>
      <BootstrapForm.Control
        type="email"
        value={email}
        onChange={(e) =>
            setEmail(e.target.value)
        }
      />
    </BootstrapForm.Group>

    <BootstrapForm.Group controlId="email">
      <BootstrapForm.Label>Password</BootstrapForm.Label>
      <BootstrapForm.Control
        type="password"
        value={password}
        onChange={(e) =>
            setPassword(e.target.value)
        }
      />
    </BootstrapForm.Group>
  </BootstrapForm>
</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={closeModal}>
    Cancel
  </Button>
  <Button variant="primary"
   onClick={handleSubmit} 
   >
Register
  </Button>
</Modal.Footer>
</Modal>
    )
}