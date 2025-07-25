"use client";

export default function WardenProfile() {
  return (
    <div className="h-full bg-[#f5f6fa] pl-5 pr-5 flex flex-col">
      {/* Section Title with Red Line */}
      <div className="flex items-center mt-8 mb-5">
        <div className="h-7 w-1 bg-[#FF0000] rounded mr-3" />
        <span className="text-lg font-semibold">Warden Profile</span>
      </div>

      {/* Flex container for Profile Info and Basic Info */}
      <div className="flex flex-row items-start ml-0 space-x-6">
        {/* Profile Info */}
        <div
          className="bg-[#BEC5AD] rounded-[20px] shadow-md flex flex-col items-center justify-center"
          style={{ width: "223px", height: "300px", opacity: 1 }}
        >
          {/* Centered Circle Avatar */}
          <div
            className="rounded-full bg-[#FFFFFF]"
            style={{ width: "80px", height: "80px", marginBottom: "20px" }}
          />
          {/* Name */}
          <div className="text-[#232323] font-bold text-2xl mt-2">Nouman Khan</div>
          {/* Student ID */}
          <div className="text-sm text-gray-700 mt-3">Student ID: HFL-001</div>
          {/* Edit Profile button */}
          <button className="mt-6 px-8 py-2 rounded-md bg-[#A4B494] text-[#232323] font-bold shadow transition hover:bg-[#FFFFFF]">
            Edit Profile
          </button>
        </div>

        {/* Basic Information */}
        <div
          className="rounded-[20px] px-5 py-4 flex-1"
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 4px 20px 0px #00000040",
            height: "300px",
            overflowY: "auto",
          }}
        >
          <div className="w-full flex justify-center mb-4">
            {/* Basic Information Title Box */}
            <div
              className="flex items-center justify-center rounded-[20px] px-6"
              style={{
                maxWidth: 1200,
                height: 50,
                backgroundColor: "#BEC5AD",
                opacity: 1,
                borderRadius: "20px",
                marginBottom: "10px",
              }}
            >
              <span className="text-2xl font-bold text-[#232323] font-poppins whitespace-nowrap">
                Basic Information
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-[15px] font-poppins">
            <div className="font-semibold text-gray-800">First Name:</div>
            <div>Nouman</div>

            <div className="font-semibold text-gray-800">Last Name:</div>
            <div>Khan</div>

            <div className="font-semibold text-gray-800">Email Address:</div>
            <div className="break-all">gawadechinmay01@gmail.com</div>

            <div className="font-semibold text-gray-800">Warden ID:</div>
            <div>WDN - 001</div>

            <div className="font-semibold text-gray-800">Phone No:</div>
            <div>9321625533</div>

            <div className="font-semibold text-gray-800">Department:</div>
            <div>Student Affairs</div>
          </div>
        </div>
      </div> {/* end flex container */}
    </div>
  );
}