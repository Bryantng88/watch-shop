# Edit Google calendar events in the web app

External Google events open an editor for title, start/end dates and hours,
all-day selection, location and description. Bangkok time is used for hours;
the displayed all-day end date is inclusive and is converted to Google's
exclusive end date on save. Recurring events update only the selected instance.
Task-linked events continue using the existing permission-aware task editor.

The server resolves the calendar from the authenticated user's connection,
fetches the event again, rejects locked/cancelled/special or task-linked events,
and allows normal events when the organizer belongs to that calendar or guests
may modify it. Google remains the final authority for write permission. An ETag
comparison and conditional PATCH protect concurrent changes. PATCH includes only
the five editable fields, preserving attendees, recurrence and other metadata.
Failures remain in the dialog with the entered values intact. Success updates
the local event immediately, cancels obsolete reads and refreshes Google data.

References: [Google event fields](https://developers.google.com/workspace/calendar/api/v3/reference/events),
[partial updates](https://developers.google.com/workspace/calendar/api/v3/reference/events/patch),
[conditional requests](https://developers.google.com/workspace/calendar/api/guides/version-resources).

Run `tsx --test src/domains/personal-work/server/google-event-edit.test.ts`.
Database and Google boundaries in this test are fully mocked; it never writes
real events or database rows. It checks timed/all-day payloads, connection
isolation, task links, read-only and guest-modifiable events, invalid ranges,
ETags and Google 403/412 responses.

Browser verification used a temporary development fixture with a fake save
callback: title/location editing, all-day inclusive end, readonly controls,
and error retention passed without real Google requests. The fixture is removed
after verification and is not part of the release source.
