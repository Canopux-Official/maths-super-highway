export interface Course {
  _id: string;
  title: string;
  content: string;
  itemType: string;
}


export interface Testimonial {
    _id: string;
    rating: number;
    message: string;
    createdAt: string;
    user: { name: string };
    course: { title: string };
}