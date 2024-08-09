# Sử dụng image Node.js làm base
FROM node:20

# Thiết lập thư mục làm việc
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Build ứng dụng
RUN npm run build

# Expose port ứng dụng sẽ chạy
EXPOSE 3000

# Chạy lệnh để khởi động ứng dụng
CMD ["npm", "run", "start:dev"]
