import React, { useState, useEffect } from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdb-react-ui-kit";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { Button, Modal, Form as BootstrapForm } from "react-bootstrap";
import { useAdminUpdateUserMutation } from "../../slices/adminApiSlice";
import { toast } from "react-toastify";
import { useDeleteUserDataMutation } from "../../slices/adminApiSlice";
import { RegisterModal } from "./RegisterModal";
import "./userTable.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const UsersTable = ({ users, refetchData }) => {
  const [showRegisterModal, setShowURegisterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userIdToUpdate, setUserIdToUpdate] = useState("");
  const [userNameToUpdate, setUserNameToUpdate] = useState("");
  const [userEmailToUpdate, setUserEmailToUpdate] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const { adminInfo } = useSelector((state) => state.adminAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (adminInfo) {
      navigate("/admin/get-user");
    } else {
      navigate("/admin");
    }
  }, [adminInfo, navigate]);

  const closeRegisterModal = () => {
    setShowURegisterModal(false);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [updateUserByAdmin, { isLoading: isUpdating }] =
    useAdminUpdateUserMutation();
  const [deleteUserByAdmin] = useDeleteUserDataMutation();

  const handleOpenUpdateModal = (user) => {
    setUserIdToUpdate(user._id);
    setUserNameToUpdate(user.name);
    setUserEmailToUpdate(user.email);
    setShowUpdateModal(true);
  };

  const handleDelete = async (user) => {
    try {
      const responseFromApiCall = await deleteUserByAdmin({
        userId: user._id,
      });
      console.log(responseFromApiCall);
      toast.success("User Deleted Succesfully");
      refetchData();
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z]{3,}$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]{1,}@/;
    return emailRegex.test(email);
  };

  const handleUpdate = async () => {
    if (!validateName(userNameToUpdate)) {
      toast.error("Name must contain only letters and be at least 3 characters long.");
      return;
    }

    if (!validateEmail(userEmailToUpdate)) {
      toast.error("Enter a valid email");
      return;
    }

    try {
      const responseFromApiCall = await updateUserByAdmin({
        userId: userIdToUpdate,
        name: userNameToUpdate,
        email: userEmailToUpdate,
      });
      toast.success("User Updated Successfully.");
      setUserIdToUpdate(null);
      setShowUpdateModal(false);
      refetchData();
    } catch (err) {
      toast.error(err?.data?.message || err?.error);
    }
  };

  return (
    <>
      <div className="containerS">
        <div>
          <BootstrapForm>
            <BootstrapForm.Group
              className="mt-3"
              controlId="exampleForm.ControlInput1"
            >
              <BootstrapForm.Label>Search users:</BootstrapForm.Label>
              <BootstrapForm.Control
                style={{ width: "500px" }}
                value={searchQuery}
                type="text"
                placeholder="Enter Name or email........"
                onChange={handleSearch}
              />
            </BootstrapForm.Group>
          </BootstrapForm>
        </div>
      </div>
      <br />

      <Button
        className="dark-button"
        onClick={() => setShowURegisterModal(true)}
      >
        Add User
      </Button>

      <MDBTable align="middle">
        <MDBTableHead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {filteredUsers.map((item, index) => (
            <tr key={index}>
              <td>
                <div className="d-flex align-items-center">
                  <div className="ms-3">
                    <p className="fw-bold mb-1">{item.name}</p>
                  </div>
                </div>
              </td>
              <td>
                <p className="fw-normal mb-1">{item.email}</p>
              </td>
              <td>
                <Button
                  variant="transparent"
                  size="sm"
                  onClick={() => handleOpenUpdateModal(item)}
                >
                  <AiFillEdit />
                </Button>
              </td>
              <td>
                <Button
                  variant="transparent"
                  size="sm"
                  onClick={() => handleDelete(item)}
                >
                  <AiFillDelete />
                </Button>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BootstrapForm>
            <BootstrapForm.Group controlId="name">
              <BootstrapForm.Label>Name</BootstrapForm.Label>
              <BootstrapForm.Control
                type="text"
                value={userNameToUpdate}
                onChange={(e) => setUserNameToUpdate(e.target.value)}
              />
            </BootstrapForm.Group>
            <BootstrapForm.Group controlId="email">
              <BootstrapForm.Label>Email</BootstrapForm.Label>
              <BootstrapForm.Control
                type="email"
                value={userEmailToUpdate}
                onChange={(e) => setUserEmailToUpdate(e.target.value)}
              />
            </BootstrapForm.Group>
          </BootstrapForm>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
      {showRegisterModal && (
        <RegisterModal
          showModal={showRegisterModal}
          closeModal={closeRegisterModal}
          refetchData={refetchData}
        />
      )}
    </>
  );
};
