


"use client";

import { useState, useEffect } from "react";
import {
  Edit2,
  Trash2,
  Clock,
  X,
} from "lucide-react";
import axios from "axios";

const StaffAllotment = () => {

  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      contactNumber: "",
      emailId: "",
      designation: "",
      otherDesignation: "",
      shiftStart: "",
      shiftEnd: "",
      salary: "",
    });

  const [staffs, setStaffs] =
    useState([]);

  const [successMsg, setSuccessMsg] =
    useState("");

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState(null);

  // Fetch Staff
  useEffect(() => {

    fetchStaffs();

  }, []);

  const fetchStaffs = async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:5224/api/staffauth/all"
        );

      const formattedData =
        response.data.staffs.map(
          (staff) => ({

            id: staff._id,

            firstName:
              staff.firstName,

            lastName:
              staff.lastName,

            name: `${staff.firstName} ${staff.lastName}`,

            email:
              staff.email,

            contactNumber:
              staff.contactNumber,

            designation:
              staff.designation,

            shiftStart:
              staff.shiftStart,

            shiftEnd:
              staff.shiftEnd,
          })
        );

      setStaffs(formattedData);

    } catch (error) {

      console.error(error);
    }
  };

  // Input Change
  const handleInputChange = (e) => {

    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Register Staff
  const handleRegisterStaff =
    async () => {

      try {

        const payload = {

          firstName:
            formData.firstName,

          lastName:
            formData.lastName,

          email:
            formData.emailId,

          staffId: `S${Date.now()
            .toString()
            .slice(-4)}`,

          contactNumber:
            formData.contactNumber,

          designation:
            formData.designation ===
            "Other"
              ? formData.otherDesignation
              : formData.designation,

          shiftStart:
            formData.shiftStart,

          shiftEnd:
            formData.shiftEnd,

          salary:
            formData.salary,
        };

        const response =
          await axios.post(
            "http://localhost:5224/api/staffauth/register-staff",
            payload,
            { headers: { Authorization: `Bearer ${localStorage.getItem("wardenToken")}` } }
          );

        setSuccessMsg(
          response.data.message || "Staff registration request submitted for Admin approval"
        );

        fetchStaffs();

        setFormData({
          firstName: "",
          lastName: "",
          contactNumber: "",
          emailId: "",
          designation: "",
          otherDesignation: "",
          shiftStart: "",
          shiftEnd: "",
          salary: "",
        });

        setTimeout(() => {
          setSuccessMsg("");
        }, 3000);

      } catch (error) {

        console.error(error);

        setSuccessMsg(
          "Error registering staff"
        );
      }
    };

  // Edit Staff
  const handleEditStaff =
    (staff) => {

      setSelectedId(
        staff.id
      );

      setFormData({
        firstName:
          staff.firstName,

        lastName:
          staff.lastName,

        contactNumber:
          staff.contactNumber,

        emailId:
          staff.email,

        designation:
          staff.designation,

        shiftStart:
          staff.shiftStart,

        shiftEnd:
          staff.shiftEnd,

        salary:
          staff.salary || "",
      });

      setShowEditModal(true);
    };

  // Update Staff
  const handleUpdateStaff =
    async () => {

      try {

        const payload = {

          firstName:
            formData.firstName,

          lastName:
            formData.lastName,

          email:
            formData.emailId,

          contactNumber:
            formData.contactNumber,

          designation:
            formData.designation ===
            "Other"
              ? formData.otherDesignation
              : formData.designation,

          shiftStart:
            formData.shiftStart,

          shiftEnd:
            formData.shiftEnd,

          salary:
            formData.salary,
        };

        await axios.put(
          `http://localhost:5224/api/staffauth/update/${selectedId}`,
          payload
        );

        setSuccessMsg(
          "Staff updated successfully"
        );

        fetchStaffs();

        setShowEditModal(false);

      } catch (error) {

        console.error(error);
      }
    };

  // Delete Staff
  const handleDeleteStaff =
    (id) => {

      setSelectedId(id);

      setShowDeleteModal(true);
    };

  const confirmDeleteStaff =
    async () => {

      try {

        await axios.delete(
          `http://localhost:5224/api/staffauth/delete/${selectedId}`
        );

        fetchStaffs();

        setSuccessMsg(
          "Staff deleted successfully"
        );

      } catch (error) {

        console.error(error);
      }

      setShowDeleteModal(false);
    };

  return (
    <div className="flex-1 bg-white p-4 sm:p-6 mt-5">

      {/* Header */}
      <div className="mb-6">

        <div className="flex items-center mb-4">

          <div className="w-[4px] h-6 bg-[#4F8CCF] mr-3" />

          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Staff Allotment
          </h1>

        </div>
      </div>

      {/* Register Staff */}
      <div
        className="bg-[#BEC5AD] rounded-xl p-4 sm:p-6 mb-6"
        style={{
          boxShadow:
            "0px 4px 4px 0px #00000040 inset",
        }}
      >

        <h2 className="text-xl sm:text-2xl font-semibold text-black mb-6">
          Register New Staff
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* First Name */}
          <div>

            <label className="block text-base sm:text-lg text-black font-bold mb-1">
              First Name
            </label>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={
                handleInputChange
              }
              placeholder="Enter First Name"
              className="w-full p-3 border rounded-md bg-white"
            />

          </div>

          {/* Last Name */}
          <div>

            <label className="block text-base sm:text-lg text-black font-bold mb-1">
              Last Name
            </label>

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={
                handleInputChange
              }
              placeholder="Enter Last Name"
              className="w-full p-3 border rounded-md bg-white"
            />

          </div>

          {/* Contact */}
          <div>

            <label className="block text-base sm:text-lg text-black font-bold mb-1">
              Contact Number
            </label>

            <input
              type="text"
              name="contactNumber"
              value={
                formData.contactNumber
              }
              onChange={
                handleInputChange
              }
              placeholder="Enter Contact Number"
              className="w-full p-3 border rounded-md bg-white"
            />

          </div>

          {/* Email */}
          <div>

            <label className="block text-base sm:text-lg text-black font-bold mb-1">
              Email ID
            </label>

            <input
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={
                handleInputChange
              }
              placeholder="Enter Email Address"
              className="w-full p-3 border rounded-md bg-white"
            />

          </div>

          {/* Designation */}
          <div>

            <label className="block text-base sm:text-lg text-black font-bold mb-1">
              Designation
            </label>

            <select
              name="designation"
              value={
                formData.designation
              }
              onChange={
                handleInputChange
              }
              className="w-full p-3 border rounded-md bg-white"
            >

              <option value="">
                Select Designation
              </option>

              <option value="Watchman">
                Watchman
              </option>

              <option value="Cleaner">
                Cleaner
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

          {/* Other Designation */}
          {formData.designation ===
            "Other" && (

            <div>

              <label className="block text-base sm:text-lg text-black font-bold mb-1">
                Specify Designation
              </label>

              <input
                type="text"
                name="otherDesignation"
                value={
                  formData.otherDesignation
                }
                onChange={
                  handleInputChange
                }
                placeholder="Enter Designation"
                className="w-full p-3 border rounded-md bg-white"
              />

            </div>
          )}

          {/* Shift Timing */}
          <div>

            <label className="block text-base sm:text-lg text-black font-bold mb-1">
              Shift Timing
            </label>

            <div className="flex items-center gap-2">

              <input
                type="time"
                name="shiftStart"
                value={
                  formData.shiftStart
                }
                onChange={
                  handleInputChange
                }
                className="w-full p-3 border rounded-md bg-white"
              />

              <Clock />

              <input
                type="time"
                name="shiftEnd"
                value={
                  formData.shiftEnd
                }
                onChange={
                  handleInputChange
                }
                className="w-full p-3 border rounded-md bg-white"
              />

            </div>
          </div>

          {/* Salary */}
          <div>

            <label className="block text-base sm:text-lg text-black font-bold mb-1">
              Salary
            </label>

            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={
                handleInputChange
              }
              placeholder="Enter Salary Amount"
              className="w-full p-3 border rounded-md bg-white"
            />

          </div>
        </div>

        {/* Button */}
        <div className="mt-7 text-center">

          <button
            onClick={
              handleRegisterStaff
            }
            className="bg-white border border-gray-300 py-3 px-8 sm:px-12 rounded-2xl font-bold shadow-2xl"
          >
            Register Staff
          </button>

        </div>
      </div>

      {/* Success */}
      {successMsg && (

        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50">

          {successMsg}

        </div>
      )}

      {/* Manage Staff */}
      <div
        className="bg-[#BEC5AD] rounded-xl p-4 sm:p-6"
        style={{
          boxShadow:
            "inset 0px 4px 20px 0px #00000040",
        }}
      >

        <h2 className="text-xl sm:text-2xl font-bold text-black mb-6">
          Manage Staff
        </h2>

        <div className="space-y-4">

          {staffs.map(
            (staff) => (

              <div
                key={staff.id}
                className="bg-white rounded-lg p-4 flex justify-between items-center"
              >

                <div>

                  <h3 className="font-bold text-lg">
                    {staff.name}
                  </h3>

                  <p>
                    {staff.email}
                  </p>

                  <p>
                    {staff.designation}
                  </p>

                  <p>
                    Shift:
                    {" "}
                    {
                      staff.shiftStart
                    }
                    {" - "}
                    {
                      staff.shiftEnd
                    }
                  </p>

                </div>

                <div className="flex gap-4">

                  <button
                    onClick={() =>
                      handleEditStaff(
                        staff
                      )
                    }
                  >
                    <Edit2 />
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteStaff(
                        staff.id
                      )
                    }
                  >
                    <Trash2 />
                  </button>

                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-[90%] max-w-2xl">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-2xl font-bold">
                Edit Staff
              </h2>

              <button
                onClick={() =>
                  setShowEditModal(
                    false
                  )
                }
              >
                <X />
              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <input
                type="text"
                name="firstName"
                value={
                  formData.firstName
                }
                onChange={
                  handleInputChange
                }
                placeholder="First Name"
                className="p-3 border rounded-md"
              />

              <input
                type="text"
                name="lastName"
                value={
                  formData.lastName
                }
                onChange={
                  handleInputChange
                }
                placeholder="Last Name"
                className="p-3 border rounded-md"
              />

              <input
                type="text"
                name="contactNumber"
                value={
                  formData.contactNumber
                }
                onChange={
                  handleInputChange
                }
                placeholder="Contact Number"
                className="p-3 border rounded-md"
              />

              <input
                type="email"
                name="emailId"
                value={
                  formData.emailId
                }
                onChange={
                  handleInputChange
                }
                placeholder="Email"
                className="p-3 border rounded-md"
              />

              <select
                name="designation"
                value={
                  formData.designation
                }
                onChange={
                  handleInputChange
                }
                className="p-3 border rounded-md"
              >

                <option value="">
                  Select
                </option>

                <option value="Watchman">
                  Watchman
                </option>

                <option value="Cleaner">
                  Cleaner
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

              {formData.designation ===
                "Other" && (

                <input
                  type="text"
                  name="otherDesignation"
                  value={
                    formData.otherDesignation
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder="Specify Designation"
                  className="p-3 border rounded-md"
                />
              )}

              <div className="flex gap-2">

                <input
                  type="time"
                  name="shiftStart"
                  value={
                    formData.shiftStart
                  }
                  onChange={
                    handleInputChange
                  }
                  className="p-3 border rounded-md w-full"
                />

                <input
                  type="time"
                  name="shiftEnd"
                  value={
                    formData.shiftEnd
                  }
                  onChange={
                    handleInputChange
                  }
                  className="p-3 border rounded-md w-full"
                />

              </div>

              <input
                type="number"
                name="salary"
                value={
                  formData.salary
                }
                onChange={
                  handleInputChange
                }
                placeholder="Salary"
                className="p-3 border rounded-md"
              />
            </div>

            <div className="flex justify-end mt-6">

              <button
                onClick={
                  handleUpdateStaff
                }
                className="bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                Update
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm">

            <h2 className="text-xl font-bold text-center mb-5">
              Delete Staff?
            </h2>

            <div className="flex justify-center gap-4">

              <button
                onClick={() =>
                  setShowDeleteModal(
                    false
                  )
                }
                className="px-5 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={
                  confirmDeleteStaff
                }
                className="px-5 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAllotment;