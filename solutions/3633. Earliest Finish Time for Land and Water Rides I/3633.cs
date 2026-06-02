// Approach: Evaluate both valid orders (land then water, and water then land) and take the minimum finish time.
// For a fixed order, first find the earliest completion among the first ride type, then combine with each second ride using max(firstCompletion, secondStart) + secondDuration.
// Time: O(n + m) Space: O(1)

public class Solution
{
    public int EarliestFinishTime(int[] landStartTime, int[] landDuration, int[] waterStartTime, int[] waterDuration)
    {
        // Calculate finish time if land tasks are done first, then water tasks
        int landThenWaterTime = CalculateSequentialFinishTime(
            landStartTime, landDuration, waterStartTime, waterDuration);

        // Calculate finish time if water tasks are done first, then land tasks
        int waterThenLandTime = CalculateSequentialFinishTime(
            waterStartTime, waterDuration, landStartTime, landDuration);

        // Return the minimum of the two possible orderings
        return Math.Min(landThenWaterTime, waterThenLandTime);
    }

    private int CalculateSequentialFinishTime(
        int[] firstStartTimes, int[] firstDurations,
        int[] secondStartTimes, int[] secondDurations)
    {
        // Find the earliest completion time among all first tasks
        int earliestFirstTaskCompletion = int.MaxValue;
        for (int i = 0; i < firstStartTimes.Length; i++)
        {
            int taskEndTime = firstStartTimes[i] + firstDurations[i];
            earliestFirstTaskCompletion = Math.Min(earliestFirstTaskCompletion, taskEndTime);
        }

        // Find the earliest total completion time when starting second tasks
        // after completing at least one first task
        int earliestTotalCompletion = int.MaxValue;
        for (int i = 0; i < secondStartTimes.Length; i++)
        {
            // Second task can only start after both:
            // 1. Its own start time constraint
            // 2. At least one first task is complete
            int actualSecondTaskStart = Math.Max(earliestFirstTaskCompletion, secondStartTimes[i]);
            int totalCompletionTime = actualSecondTaskStart + secondDurations[i];
            earliestTotalCompletion = Math.Min(earliestTotalCompletion, totalCompletionTime);
        }

        return earliestTotalCompletion;
    }
}