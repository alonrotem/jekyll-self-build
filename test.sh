#!/bin/bash

#filenames as normal non-latin characters
echo "Fetching yq..."
git config core.quotepath false
wget https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -q -O ./yq && chmod +x ./yq

echo "Scannin for change files..."
lastchangedfiles=$(git diff --name-only --diff-filter=acdrtux HEAD~1 HEAD)
numOfchanges=$(echo "$lastchangedfiles" | wc -l)
if [[ $numOfchanges > 0 ]]
then
    echo "Found $numOfchanges changed files:"
    for fn in $lastchangedfiles
    do
        echo "------------"
        echo "changed: $fn"
        curr_commit=$(git log -n 1 --pretty=format:%H -- $fn)
        previous_commit=$(git log -n 1 --skip 1 --pretty=format:%H -- $fn)

        curr_content=$(cat $fn)
        prev_content=$(git show $previous_commit:$fn)

        echo "Currnet commit: $curr_commit"
        echo "Previous commit: $previous_commit"

        if [[ $fn =~ ^_posts/.* ]]
        then
            if \
                [[ $curr_content =~ ^\-{3,}.*hidden\:\ *false.*\-{3,} ]] && \
                [[ $prev_content =~ ^\-{3,}.*hidden\:\ *true.*\-{3,} ]]
            then
                echo "This post was unhiddedn!"
                
                # Add redirect
                # ----------------------

                # Get the post's frontmatter and content
                [[ $curr_content =~ \-{3,}(.*)\-{3,}(.*) ]]
                echo "${BASH_REMATCH[1]}" > frontmatter.yml
                echo "${BASH_REMATCH[2]}" > article.txt

                post_category=$(./yq '.category' frontmatter.yml)
                filename=$(basename -- "$fn")
                extension="${filename##*.}"
                filename="${filename%.*}"
                pathname=$(dirname $fn)

                [[ $filename =~ ([0-9]{4})-([0-9]{2})-([0-9]{2})-([0-9]{2})-([0-9]{2})-(.*) ]]
                original_yy=${BASH_REMATCH[1]}
                original_mm=${BASH_REMATCH[2]}
                original_dd=${BASH_REMATCH[3]}
                original_h=${BASH_REMATCH[4]}
                original_m=${BASH_REMATCH[5]}
                original_name=${BASH_REMATCH[6]}
                
                echo "original_yy: $original_yy"
                echo "original_mm: $original_mm"
                echo "original_dd: $original_dd"
                echo "original_h: $original_h"
                echo "original_m: $original_m"
                echo "original_name: $original_name"
                
                now_yy=$(date '+%Y')
                now_mm=$(date '+%m')
                now_dd=$(date '+%d')
                now_h=$(date '+%H')
                now_m=$(date '+%M')

                old_url="/$post_category/$original_yy/$original_mm/$original_dd/$original_h-$original_m-$original_name"
                new_filename="$pathname/$now_yy-$now_mm-$now_dd-$now_h-$now_m-$original_name.$extension"

                # Append the redirect and append to temporary file
                with_redirect=$(./yq  ".redirect_from += [\"$old_url\"]" frontmatter.yml)
                echo "$with_redirect" > frontmatter.yml

                echo "---" > $fn
                cat frontmatter.yml >> $fn
                echo "---" >> $fn
                cat article.txt >> $fn

                rm frontmatter.yml
                rm article.txt

                mv $fn $new_filename
            else
                echo "This file was not unhidden"
            fi
        else
            echo " -- this file is not a post"
        fi
        echo "------------"
    done
    git add .
    git commit -m"Automated articles fix"
    git push
else
    echo "No changed files detected"
fi