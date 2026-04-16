const { getRedeemedRewards, getPointBalance } = require('../app/actions/loyalty');
const { apiFetch } = require('../lib/api');

// Mock apiFetch
jest.mock('../lib/api', () => ({
    apiFetch: jest.fn(),
}));

describe('Loyalty Actions', () => {
    const shopSlug = 'service';
    const token = 'fake-token';

    it('getRedeemedRewards should handle wrapped data.data array', async () => {
        const mockResponse = {
            success: true,
            data: {
                data: [
                    { id: '1', status: 'completed', reward_id: 'r1' }
                ]
            }
        };
        apiFetch.mockResolvedValueOnce(mockResponse);

        const result = await getRedeemedRewards(shopSlug, token);
        expect(result.success).toBe(true);
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data).toHaveLength(1);
    });

    it('getRedeemedRewards should handle direct data array', async () => {
        const mockResponse = {
            success: true,
            data: [
                { id: '1', status: 'completed', reward_id: 'r1' }
            ]
        };
        apiFetch.mockResolvedValueOnce(mockResponse);

        const result = await getRedeemedRewards(shopSlug, token);
        expect(result.success).toBe(true);
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data).toHaveLength(1);
    });

    it('getPointBalance should handle direct data object', async () => {
        const mockResponse = {
            success: true,
            data: { points: 100, stamps: 0 }
        };
        apiFetch.mockResolvedValueOnce(mockResponse);

        const result = await getPointBalance(shopSlug, token);
        expect(result.success).toBe(true);
        expect(result.data.points).toBe(100);
    });
});
