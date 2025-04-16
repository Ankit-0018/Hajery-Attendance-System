import { useAuth } from "@/hooks/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import DatePicker from "react-datepicker"; // Import date picker
import "react-datepicker/dist/react-datepicker.css"; // Import styles

const Employee = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isAdmin, setIsAdmin] = useState(false)
  const [attendanceStatus, setAttendanceStatus] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // For storing selected date

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;

      // Step 1: Get user profile
      const { data, error } = await supabase
        .from("employee_profiles")
        .select("name, phone , isAdmin")
        .eq("auth_id", user.id);

      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }

      if (data && data.length > 0) {
        const { name, phone,isAdmin } = data[0];
        setName(name);
        setPhone(phone);
        setIsAdmin(isAdmin)
      }
    };

    fetchUserDetails();
  }, [user]);

  // Fetch attendance status for a specific date
  const fetchAttendanceForDate = async (date: Date) => {
    if (!user || !date) return;

    const formattedDate = date.toISOString().split("T")[0]; // Get the date in YYYY-MM-DD format
    const startOfDay = `${formattedDate}T00:00:00`; // Start of the day
    const endOfDay = `${formattedDate}T23:59:59`; // End of the day

    const { data, error } = await supabase
      .from("attendance_history")
      .select("attendance_status, created_at")
      .eq("name", name)
      .gte("created_at", startOfDay) // Greater than or equal to the start of the day
      .lt("created_at", endOfDay); // Less than the end of the day

    if (error) {
      console.error("Error fetching attendance:", error);
      return;
    }

    if (data && data.length > 0) {
      setAttendanceStatus(data[0].attendance_status); // Get the attendance status for the selected date
    } else {
      setAttendanceStatus("No attendance record for this date");
    }
  };

  // Call fetchAttendanceForDate when the user selects a new date
  useEffect(() => {
    if (selectedDate) {
      fetchAttendanceForDate(selectedDate);
    }
  }, [selectedDate]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="p-5">
      <p>Hello {user?.email}</p>
      <p>Name: {name}</p>
      <p>Phone: {phone}</p>

      {/* Date Picker for selecting a date */}
      <div className="my-4">
        <label>Select Date for Attendance: </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date) => setSelectedDate(date)}
          dateFormat="yyyy/MM/dd"
          className="border p-2 rounded mt-2"
          placeholderText="Click to select a date"
        />
      </div>

      <p>Attendance Status: {attendanceStatus}</p>
      
      <button onClick={handleLogout} className="border-2 px-3 py-2 bg-red-400 rounded m-10">
        Log out
      </button>
    </div>
  );
};

export default Employee;
