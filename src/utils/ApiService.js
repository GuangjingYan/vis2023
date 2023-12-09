import ApiClient from './ApiClient'; 

class ApiService {
    /*
    * GetAllComments
    * It is called at the first time when the user enter the project page.
    * HTTP Method: GET
    * @resource: /all_comments_data
    * @param {string} submissionId
    * @returns {json} all comments data of submissionId.
    * example: /all_comments_data?submissionId=1234
     */
    static async GetAllCommentsData(submissionId, topk, ) {
        try {
            const response = await ApiClient.get('/all_comments_data', {
                params: {
                    submissionId: submissionId
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    }

    /*
    * GetAllClusterData
    * It is called at the first time when the user enter the project page.
    * HTTP Method: GET
    * @resource: /cluster_comments
    * @param {string} submissionId
    * @param {string} topk
    * @returns {json} cluster file of submissionId.
    * example: /cluster_comments?submissionId=1234&topk=10
    */
    static async GetAllClusterData(submissionId, topk) {
        try {
            const response = await ApiClient.get('/cluster_comments', {
                params: {
                    submissionId: submissionId,
                    topk: topk,
                }
            }); 
            return response.data;
        } catch (error) {
            console.error('Error fetching project:', error);
            throw error;
        }
    }

    /*
    * GetClusterData
    * It is called when user select a cluster with a time range.
    * HTTP Method: GET
    * @resource: /cluster_data
    * @param {string} submissionId
    * @param {string} topk
    * @param {string} start
    * @param {string} end
    * @returns {json} cluster data of submissionId.
    * example: /cluster_data?submissionId=1234&topk=10&start=20200101&end=20200102
    */
    static async GetClusterData(submissionId, topk, start, end) {
        try {
            const response = await ApiClient.get('/cluster_data', {
                params: {
                    submissionId: submissionId,
                    topk: topk,
                    start: start,
                    end: end
                }
            }); 
            return response.data;
        } catch (error) {
            console.error('Error fetching project:', error);
            throw error;
        }
    }

    /*
    * SendBrushedData
    * It is called when user brush the with a time range.
    * HTTP Method: get
    * @resource: /brushed_data
    * @param {string} submissionId
    * @param {string} topk
    * @body {json} : brused Data Idx List
    * @returns {json} summarization of brushed data.
    * example: /brushed_data?submissionId=1234&topk=10
    */
    static async SendBrushedData(submissionId, topk, brushedIdxList) {
        try {

            const response = await ApiClient.post('/brushed_data', {
                brushed_index_list: brushedIdxList
            }, {
                params: {
                    submissionId: submissionId,
                    topk: topk,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error posting project:', error);
            throw error;
        }
    }

    /*
    * GetTrendData
    * It is called at the first time when the user enter the project page.
    * HTTP Method: GET
    * @resource: /trend_data
    * @param {string} submissionId
    * @param {string} interval
    * @returns {json} trend data of all and each cluster of submissionId.
    * example: /trend_data?submissionId=1234&interval=day
    */
    static async GetTrendData(submissionId, interval) {
        try {
            const response = await ApiClient.get('/trend_data', {
                params: {
                    submissionId: submissionId,
                    interval: interval,
                }
            }); 
            return response.data;
        } catch (error) {
            console.error('Error fetching project:', error);
            throw error;
        }
    }
}

export default ApiService;
