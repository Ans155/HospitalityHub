const Booking = require('../model/Booking');

exports.filterBookings = async (req, res) => {
  try {
    const filterData = req.body;

    // Build the filter criteria
    const filterCriteria = {};

    if (filterData.roomNumber) {
      filterCriteria.roomNumber = parseInt(filterData.roomNumber, 10);
    }

    if (filterData.roomType) {
      filterCriteria.roomType = { $regex: filterData.roomType, $options: 'i' };
    }

    if (filterData.startDate) {
      // Extract the date part (YYYY-MM-DD) from the input date string
      const startDateDatePart = filterData.startDate.substring(0, 10);

      // Convert the date part to a timestamp
      const startDateTimestamp = new Date(startDateDatePart).getTime();

      // Set the filter criteria for startDate
      filterCriteria.startTime = {
        $gte: startDateTimestamp,
        //$lt: startDateTimestamp + 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      };
    }

    if (filterData.endDate) {
      // Extract the date part (YYYY-MM-DD) from the input date string
      const endDateDatePart = filterData.endDate.substring(0, 10);

      // Convert the date part to a timestamp
      const endDateTimestamp = new Date(endDateDatePart).getTime();

      // Set the filter criteria for endDate
      filterCriteria.endTime = {
        //$gte: endDateTimestamp,
        $lt: endDateTimestamp, // 24 hours in milliseconds
      };
    }

    const filteredBookings = await Booking.find(filterCriteria).exec();

    if (!filteredBookings || filteredBookings.length === 0) {
      return res.status(200).json({ bookings: [] });
    }

    res.status(200).json(filteredBookings);
  } catch (error) {
    console.error('Error filtering bookings:', error);
    res.status(500).json({ error: 'Failed to filter bookings' });
  }
};