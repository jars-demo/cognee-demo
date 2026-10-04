# Northwind Trails: decisions log

- The Platform team decided to store offline map tiles in SQLite on the device, because it works
  on both iOS and Android without extra libraries. Ravi Patel proposed it; Maya Chen approved it.
- The Mobile team decided to ship offline mode on Android first, because most hikers in the beta
  use Android phones. Sofia Alvarez made the call.
- The company decided not to show trail conditions older than 48 hours, because stale closure
  data is worse than no data. This affects Project Riverbend.
