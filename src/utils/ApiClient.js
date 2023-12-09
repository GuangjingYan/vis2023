import axios from 'axios';

// Axios 인스턴스를 생성하고 기본 URL을 설정합니다.
const apiClient = axios.create({
    baseURL: 'http://ds1.snu.ac.kr:9998',
    // 
});

export default apiClient;