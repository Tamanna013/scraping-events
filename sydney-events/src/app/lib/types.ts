export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  images: string[]; // can be up to 100 URLs
  ticketUrl: string;
}
