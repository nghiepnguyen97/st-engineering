import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';

const BASE_URL = `http://localhost:3003/file`;

export enum SearchOperationEnum {
	Search = 'search',
	FullTextSearch = 'fullTextSearch',
	SearchStartWith = 'searchStartWith'
}

interface ISearch {
	column: string,
	data: any
}

interface IFilters {
	page: number,
	properties: {
		[key in SearchOperationEnum]: ISearch
	}
}

interface IFileData {
	postId: number;
	id: number;
	name: string;
	email: string;
	body: string;
}

const App: React.FC = () => {
	const [file, setFile] = useState<File | null>(null);
	const [uploadStatus, setUploadStatus] = useState<string | null>(null);
	const [tableData, setTableData] = useState<IFileData[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchData, setSearchData] = useState('');
	const [searchColumn, setSearchColumn] = useState<string>('');
	const [pagination, setPagination] = useState<{
		pages: number,
		current: number,
		total: number
	}>({
		pages: 1,
		current: 1,
		total: 1
	});

	const [filters, setFilters] = useState<IFilters>({
		page: 1,
		properties: {} as any
	});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async (filters?: IFilters) => {
		try {
			const baseFilters = {
				properties: {},
				page: 1
			}
			if (filters) {
				baseFilters.properties = filters.properties;
				baseFilters.page = filters.page;
			}

			const response = await fetch(`${BASE_URL}/items?filters=${JSON.stringify(baseFilters)}`);
			if (!response.ok) {
				throw new Error(`Failed to fetch data. Status: ${response.status}`);
			}
			const responseData = await response.json();
			const { pages, current, total, data } = responseData.data;
			setTableData(data);
			setPagination({
				...pagination,
				pages,
				current,
				total
			})
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const uploadedFile = e.target.files[0];
			setFile(uploadedFile);

			const formData = new FormData();
			formData.append('file', uploadedFile);

			try {
				setUploadStatus('Uploading file...');
				const response = await fetch(`${BASE_URL}/upload`, {
					method: 'POST',
					body: formData,
				});
				setUploadStatus('Upload complete');
				setTimeout(() => {
					setUploadStatus(null);
				}, 1000);

				if (!response.ok) {
					throw new Error(`Failed to upload file. Status: ${response.status}`);
				}
				console.log('File uploaded successfully!');
				fetchData();
			} catch (error) {
				console.error('Error uploading file:', error);
			}
		}
	};

	const paginate = (page: number) => {
		filters.page = page;
		setCurrentPage(page);
		setFilters(filters)
		fetchData(filters)
	}

	const columns = [
		{ dataField: 'postId', text: 'PostId' },
		{ dataField: 'id', text: 'ID' },
		{ dataField: 'name', text: 'Name' },
		{ dataField: 'email', text: 'Email' },
		{ dataField: 'body', text: 'Body' }
	];

	const handleSearch = () => {
		if (searchColumn && searchData) {
			filters.page = 1;
			filters.properties.searchStartWith = undefined as any;
			filters.properties.search = {
				column: searchColumn,
				data: searchData
			}

			fetchData(filters);
		}
	};

	const handleSearchStartsWith = () => {
		if (searchColumn && searchData) {
			filters.page = 1;
			filters.properties.search = undefined as any;
			filters.properties.searchStartWith = {
				column: searchColumn,
				data: searchData
			}

			fetchData(filters);
		}
	};


	const clearFilters = () => {
		setSearchData('');
		setSearchColumn('');
		fetchData();
	};

	return (
		<Container fluid>
			<Row>
				<Col sm={12} md={8}>
					<Row>
						<Col>
							<input type="file" onChange={handleFileUpload} />
						</Col>
					</Row>
					{uploadStatus && (
						<Row>
							<Col>
								<div className="alert alert-info" role="alert">
									{uploadStatus}
								</div>
							</Col>
						</Row>
					)}
					<InputGroup className="mt-3">
						<FormControl
							placeholder="Search..."
							value={searchData}
							onChange={(e) => setSearchData(e.target.value)}
						/>
						<select
							className="form-select"
							value={searchColumn}
							onChange={(e) => setSearchColumn(e.target.value)}
						>
							<option value="">All</option>
							{columns.map(col => (
								<option key={col.dataField} value={col.dataField}>
									{col.text}
								</option>
							))}
						</select>
						<Button onClick={handleSearch} className="btn btn-primary">Search</Button>
						<Button onClick={handleSearchStartsWith} className="btn btn-primary ms-2">Search StartsWith</Button>
						<Button onClick={clearFilters} className="btn btn-secondary ms-2">Clear Filters</Button>
					</InputGroup>
				</Col>
			</Row>

			<Row className="mt-3">
				<Col sm={12} md={8}>
					<BootstrapTable
						keyField='id'
						data={tableData}
						columns={columns}
					/>
					{tableData.length > 0 && (
						<Pagination
							pages={pagination.pages}
							current={pagination.current}
							total={pagination.total}
							paginate={paginate}
						/>
					)}
				</Col>
			</Row>
		</Container>
	);
};

const Pagination: React.FC<{
	pages: number,
	current: number,
	total: number
	paginate: (pageNumber: number) => void;
}> = ({ pages, current, total, paginate }) => {
	const _pages = [];

	for (let i = 1; i <= pages; i++) {
		_pages.push(i);
	}

	return (
		<nav className="mt-3 d-flex justify-content-center">
			<ul className="pagination">
				<li className={`page-item ${current === 1 ? 'disabled' : ''}`}>
					<Button onClick={() => paginate(current - 1)} className="page-link">Previous</Button>
				</li>
				{_pages.map(page => (
					<li key={page} className={`page-item ${current === page ? 'active' : ''}`}>
						<Button onClick={() => paginate(page)} className="page-link">{page}</Button>
					</li>
				))}
				<li className={`page-item ${current === pages ? 'disabled' : ''}`}>
					<Button onClick={() => paginate(current + 1)} className="page-link">Next</Button>
				</li>
			</ul>
		</nav>
	);
};

export default App;
