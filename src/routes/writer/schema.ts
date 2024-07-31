export interface Book {
	id: number;
	title: string;
}

export interface Work {
	url: string;
	title: string;
	bookId?: number;
	genreId?: number;
	date: number;
	content?: string;
}

export interface Writer {
	id: string;
	name: string;
	biography: string;
	books: Book[];
	works: Work[];
}
