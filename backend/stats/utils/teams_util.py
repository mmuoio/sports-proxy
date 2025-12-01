#sorting, formatting, math, parsing helpers
#doing stuff with existing data

def transform_stat_lists(stats_list: list) ->dict:
	if not stats_list:
		return {}
	return {
		stat['name']: stat['value']
		for stat in stats_list
		if 'name' in stat and 'value' in stat
	}