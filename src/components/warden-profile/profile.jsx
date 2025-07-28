"use client";

export default function WardenProfile() {
  return (
    <div className="min-h-screen bg-[#f5f6fa] px-2 sm:px-4 md:px-10 flex flex-col">

      {/* Section Title with Red Line */}
      <div className="flex items-center ml-1 md:ml-2 mt-2 mb-5"> {/* Changed from mt-8 to mt-2 */}
        <div className="h-7 w-1 bg-[#FF0000] rounded mr-3" />
        <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-black select-none">
          Warden Profile
        </span>
      </div>

      {/* Main Responsive Wrapper */}
      <div className="flex flex-col lg:flex-row items-start lg:space-x-8 space-y-6 lg:space-y-0 ml-0">

        {/* Profile Info */}
        <div
          className="
            bg-[#BEC5AD] rounded-[20px] shadow-md flex flex-col items-center justify-center
            w-full max-w-xs mx-auto lg:mx-0
            py-6
          "
          style={{ minWidth: 0, opacity: 1 }}
        >
          {/* Responsive Avatar */}
          <div
            className="rounded-full bg-white mb-5"
            style={{ width: 80, height: 80, minWidth: 80, minHeight: 80 }}
          />
          {/* Name & ID */}
          <div className="text-[#232323] font-bold text-xl md:text-2xl mt-2 text-center break-words">
            Nouman Khan
          </div>
          <div className="text-sm text-gray-700 mt-3 text-center break-words">
            Student ID: HFL-001
          </div>
          {/* Edit Profile Button */}
          <button className="mt-6 px-6 md:px-8 py-2 rounded-md bg-[#A4B494] text-[#232323] font-bold shadow transition hover:bg-white">
            Edit Profile
          </button>
        </div>

        {/* Basic Information */}
        <div
          className="
            rounded-[20px] flex flex-col flex-1 bg-white shadow-lg
            px-4 py-6 md:px-8
            max-w-full min-w-0
          "
          style={{
            boxShadow: "0px 4px 20px 0px #00000040",
          }}
        >
          {/* Green Header */}
          <div
            className="flex items-center justify-center rounded-[20px] w-full min-h-[44px] sm:min-h-[50px] mb-6"
            style={{
              backgroundColor: "#BEC5AD",
              opacity: 1,
              borderRadius: 20,
              marginBottom: 10,
            }}
          >
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#232323] font-poppins whitespace-nowrap select-none">
              Basic Information
            </span>
          </div>

          {/* Information List */}
          <div className="flex flex-col gap-4 sm:gap-3 px-1">
            {[
              { label: "First Name:", value: "Nouman" },
              { label: "Last Name:", value: "Khan" },
              { label: "Email Address:", value: "gawadechinmay01@gmail.com" },
              { label: "Warden ID:", value: "WDN - 001" },
              { label: "Phone No:", value: "9321625533" },
              { label: "Department:", value: "Student Affairs" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center break-words"
              >
                <span className="font-semibold text-gray-800">{label}</span>
                <span className="text-gray-900 break-words sm:text-right mt-1 sm:mt-0 max-w-full sm:max-w-[70%]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
